import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Modals Interface - Test',
  description: 'Test page for video modals interface component',
};

export default function VideoTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        {children}
      </body>
    </html>
  );
}
