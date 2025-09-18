// app/layout.tsx
import './globals.css';
import Header from './components/Header'; // adjust the path if needed

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header /> {/* Header appears on all pages */}
        <main>{children}</main>
      </body>
    </html>
  );
}
