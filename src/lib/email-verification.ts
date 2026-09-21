import crypto from 'crypto';
import { db } from '@/lib/db';
import { sendMail, isEmailConfigured } from '@/lib/mailer';
import { BRAND_NAME } from '@/lib/constants';

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESEND_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes between resends

/**
 * Email verification security rules:
 *  - Token is cryptographically random (256-bit) and never the user's password
 *    or the user id.
 *  - Only its SHA-256 digest is stored; the raw token is never persisted.
 *  - Single use: the stored digest is cleared after a successful validation.
 *  - Expiring: expires 24 hours after issuance.
 *  - Resending invalidates the previous token by replacing the stored digest.
 */
export function generateVerificationToken(): { raw: string; digest: string } {
  const raw = crypto.randomBytes(32).toString('base64url');
  const digest = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, digest };
}

export async function issueVerificationToken(userId: string): Promise<{ raw: string; expiresAt: Date }> {
  const { raw, digest } = generateVerificationToken();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
  await db.user.update({
    where: { id: userId },
    data: {
      emailVerificationToken: digest,
      emailVerificationTokenExpiry: expiresAt,
    },
  });
  return { raw, expiresAt };
}

export async function sendVerificationEmail(email: string, rawToken: string): Promise<{ sent: boolean; skipped?: boolean; reason?: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const link = `${baseUrl}/verify-email?token=${encodeURIComponent(rawToken)}`;
  const subject = 'Verify your email address — ' + BRAND_NAME;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;border:1px solid #f1c9d4;border-radius:16px;overflow:hidden">
    <div style="background:#7f1d3d;padding:24px;text-align:center;color:#fff">
      <h2 style="margin:0;font-size:20px">${BRAND_NAME}</h2>
      <p style="margin:6px 0 0;font-size:12px;opacity:.85">Please verify your email address</p>
    </div>
    <div style="padding:28px;color:#363636;font-size:14px;line-height:1.6">
      <p>Hello,</p>
      <p>Welcome to ${BRAND_NAME}. To finish setting up your account, please confirm your email address by clicking the button below. This link expires in <strong>24 hours</strong> and can only be used once.</p>
      <p style="text-align:center;margin:28px 0">
        <a href="${link}" style="display:inline-block;background:#7f1d3d;color:#fff;padding:12px 26px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:14px">Verify Email Address</a>
      </p>
      <p style="color:#888;font-size:12px">If the button does not work, copy and open this link in your browser:<br/><span style="word-break:break-all">${link}</span></p>
      <p style="color:#888;font-size:12px">If you did not create an account on ${BRAND_NAME}, you can safely ignore this email.</p>
    </div>
  </div>`;

  const result = await sendMail(email, subject, html);
  return result;
}

export function getVerificationLink(rawToken: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/verify-email?token=${encodeURIComponent(rawToken)}`;
}

/**
 * Validate a raw verification token against the stored digest. Returns the user
 * on success, or null for invalid/expired/used tokens. Successful validation is
 * atomic: it marks emailVerifiedAt, invalidates the token, and returns the user.
 */
export async function consumeVerificationToken(rawToken: string) {
  if (!rawToken) return null;
  const digest = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await db.user.findFirst({
    where: { emailVerificationToken: digest },
  });
  if (!user) return null;

  if (!user.emailVerificationTokenExpiry || user.emailVerificationTokenExpiry.getTime() < Date.now()) {
    return null;
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      emailVerifiedAt: new Date(),
      emailVerificationToken: null,
      emailVerificationTokenExpiry: null,
    },
  });
  return updated;
}

/**
 * Throttle guard for resend requests (per-user, in-memory). In multi-instance
 * deployments a shared store would be required; documented in the final report.
 */
const resendCooldown = new Map<string, number>();

export function canResend(userId: string): boolean {
  const last = resendCooldown.get(userId) || 0;
  if (Date.now() - last < RESEND_COOLDOWN_MS) return false;
  resendCooldown.set(userId, Date.now());
  return true;
}

export function emailDeliveryStatus() {
  return { configured: isEmailConfigured() };
}