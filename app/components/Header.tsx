"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import Link from "next/link";

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
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
     <Link href="/">  <h1 className="text-xl font-bold text-gray-800">FamilyNation</h1></Link> 

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
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

        {/* Exit button */}
        <button
          onClick={handleExit}
          className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded-lg shadow hover:bg-red-700"
        >
          EXIT
        </button>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <HiX className="w-6 h-6 text-gray-800" />
            ) : (
              <HiMenu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 flex flex-col gap-3">
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
