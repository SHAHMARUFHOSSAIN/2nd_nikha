import net from 'net';
import tls from 'tls';

export interface MailConfig {
  from: string;
  server: string;
  port: number;
  user: string;
  password: string;
  secure: boolean;
}

export interface MailSendResult {
  sent: boolean;
  reason?: string;
  skipped?: boolean;
}

/**
 * Minimal, dependency-free email delivery abstraction for 2nd Chance.
 *
 * Configuration is read from environment variables using the following names:
 *   EMAIL_FROM     - sender address  (e.g. "2nd Chance <no-reply@2ndchance.com>")
 *   EMAIL_SERVER   - SMTP host (e.g. smtp.yourprovider.com)
 *   EMAIL_PORT     - SMTP port (default 587; 465 for implicit TLS)
 *   EMAIL_USER     - SMTP username
 *   EMAIL_PASSWORD - SMTP password (never logged or exposed)
 *   EMAIL_SECURE   - "true" to use TLS from the first connection (port 465)
 *
 * Security rules:
 *  - Credentials are NEVER logged or returned to the client.
 *  - In development, when SMTP is unconfigured, emails are captured to the
 *    server log via a dev transport so the verification flow is testable.
 *  - In production with missing config, delivery is explicitly NOT performed
 *    and a clear reason is returned. Users are NEVER auto-marked verified
 *    without a real delivery.
 */
export function getMailConfig(): MailConfig | null {
  const server = process.env.EMAIL_SERVER;
  if (!server) return null;
  return {
    from: process.env.EMAIL_FROM || '2nd Chance <no-reply@2ndchance.com>',
    server,
    port: Number(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    secure: process.env.EMAIL_SECURE === 'true',
  };
}

export function isEmailConfigured(): boolean {
  return !!getMailConfig();
}

function buildSmtpMessage(to: string, subject: string, html: string, from: string): Buffer {
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
  ];
  const body = `${headers.join('\r\n')}\r\n\r\n${html}\r\n`;
  return Buffer.from(body, 'utf-8');
}

function sendSmtp(config: MailConfig, to: string, subject: string, html: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const message = buildSmtpMessage(to, subject, html, config.from);
    const socket = config.secure ? tls.connect(config.port, config.server) : net.connect(config.port, config.server);
    let buffer = '';
    let step = 0;

    const bail = (err: Error) => {
      socket.end();
      reject(err);
    };

    const failReplies = /^5\d\d/.test.bind(/^5\d\d/);

    socket.setTimeout(15_000, () => bail(new Error('SMTP timeout')));
    socket.on('error', bail);

    socket.on('connect', () => {
      if (config.secure) {
        sendEnvelope();
      }
      // For insecure connections we wait for the server greeting first.
    });

    socket.on('data', (chunk: Buffer) => {
      buffer += chunk.toString('utf-8');
      // We operate line-by-line on single replies (simple AUTH LOGIN flow).
      if (!buffer.includes('\n')) return;
      const lines = buffer.split('\r\n').filter((l) => l.length > 0);
      buffer = '';
      const code = lines[0] ? lines[0].slice(0, 3) : '';
      const reply = lines.length ? lines[0].slice(4) : '';

      try {
        if (failReplies(code)) {
          bail(new Error(`SMTP rejected (${code}): ${reply}`));
          return;
        }

        if (step === 0) {
          // Greeting received.
          sendEnvelope();
        } else if (step === 1) {
          // AUTH pushed, awaiting 334 username prompt.
          if (code === '334') {
            socket.write(`${Buffer.from(config.user).toString('base64')}\r\n`);
            step = 2;
          } else {
            bail(new Error(`SMTP AUTH unexpected (${code}): ${reply}`));
          }
        } else if (step === 2) {
          // Username accepted, awaiting 334 password prompt.
          if (code === '334') {
            socket.write(`${Buffer.from(config.password).toString('base64')}\r\n`);
            step = 3;
          } else {
            bail(new Error(`SMTP AUTH username rejected (${code}): ${reply}`));
          }
        } else if (step === 3) {
          // Password accepted (235).
          if (code === '235') {
            socket.write(`MAIL FROM:<${extractAddress(config.from)}>\r\n`);
            step = 4;
          } else {
            bail(new Error(`SMTP AUTH password rejected (${code})`));
          }
        } else if (step === 4) {
          socket.write(`RCPT TO:<${extractAddress(to)}>\r\n`);
          step = 5;
        } else if (step === 5) {
          socket.write('DATA\r\n');
          step = 6;
        } else if (step === 6) {
          // 354 begin mail input.
          if (code === '354') {
            socket.write(message);
            socket.write('\r\n.\r\n');
            step = 7;
          } else {
            bail(new Error(`SMTP DATA unexpected (${code}): ${reply}`));
          }
        } else if (step === 7) {
          // 250 queued.
          socket.write('QUIT\r\n');
          step = 8;
          socket.once('close', () => resolve());
          socket.end();
        }
      } catch (err) {
        bail(err as Error);
      }
    });

    let envelopeSent = false;
    function sendEnvelope() {
      if (envelopeSent) return;
      envelopeSent = true;
      socket.write(`EHLO 2ndchance.local\r\n`);
      step = 1;
    }
  });
}

function extractAddress(addr: string): string {
  const match = /<([^>]+)>/.exec(addr);
  return match ? match[1] : addr.trim();
}

/**
 * Send an HTML email.
 *
 * - Development (SMTP unconfigured): logs the would-be email to the server
 *   console using a dev transport. Returns { sent: false, skipped: true } so
 *   the caller knows no real delivery happened.
 * - Production (SMTP configured): delivers via SMTP.
 * - Production (SMTP unconfigured): does NOT attempt delivery and returns a
 *   clear reason — the platform must not silently pretend emails have sent.
 */
export async function sendMail(
  to: string,
  subject: string,
  html: string
): Promise<MailSendResult> {
  const config = getMailConfig();

  if (!config) {
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
      console.log(`\n[EMAIL DEV TRANSPORT] To: ${to}\nSubject: ${subject}\n${html}\n`);
      return { sent: false, skipped: true, reason: 'dev_transport' };
    }
    return {
      sent: false,
      skipped: true,
      reason: 'EMAIL_SERVER / EMAIL_USER / EMAIL_PASSWORD not configured — email delivery disabled in production.',
    };
  }

  try {
    await sendSmtp(config, to, subject, html);
    return { sent: true };
  } catch (err: any) {
    return { sent: false, reason: err?.message || 'SMTP delivery failed' };
  }
}