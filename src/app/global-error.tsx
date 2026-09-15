'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#FFF5F7', color: '#1C1917' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 72, marginBottom: 8 }}>💔</div>
            <h1 style={{ fontSize: 24, margin: '0 0 8px' }}>Something went wrong</h1>
            <p style={{ color: '#78716C', margin: '0 0 24px' }}>
              An unexpected error interrupted this page. Please try again.
            </p>
            <button
              onClick={reset}
              style={{
                background: '#DB2777',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '12px 24px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}