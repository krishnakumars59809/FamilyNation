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
  <body className="max-w-7xl mx-auto">
    <header className="sticky top-0 z-50 bg-white shadow">
      <Header /> {/* Header stays visible on scroll */}
    </header>
    <main>{children}</main>
  </body>
</html>

  );
}
