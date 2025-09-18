"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/images/logo.png";
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNav = (section: string) => {
    setMenuOpen(false); // close mobile menu
    if (pathname === "/") {
      // scroll to section on Home
      const el = document.getElementById(section);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      // redirect to Home with hash
      router.push(`/#${section}`);
    }
  };

  const handleExit = () => {
    router.push("/"); // redirect to Home or safe page
  };

  const navItems = [
    { name: "About", id: "about" },
    { name: "Solutions", id: "solutions" },
    { name: "Community", id: "community" },
    { name: "Resources", id: "resources" },
    { name: "Events", id: "events" },
    { name: "Why Us", id: "why-us" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative">
        {/* Hamburger Left (Mobile Only) */}
        <div className="absolute left-4 md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <HiX className="w-6 h-6 text-gray-800" />
            ) : (
              <HiMenu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>

        {/* Logo Center on Mobile, Left on Desktop */}
        <div className="mx-auto md:mx-0">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={Logo}
              alt="FamilyNation Logo"
              width={150}
              height={100}
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation Center */}
        <nav className="hidden md:flex flex-1 justify-center gap-6 text-gray-700 font-medium">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="hover:text-blue-600 transition"
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Exit Button Right */}
        <div className="absolute right-4 flex items-center gap-2">
          <button
            onClick={handleExit}
            className="p-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 flex items-center justify-center"
            aria-label="Exit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 flex flex-col gap-3 mt-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="text-left text-gray-700 py-2 hover:bg-gray-100 rounded transition"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
