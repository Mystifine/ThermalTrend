'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Breakouts", href: "/breakouts" },
    { name: "Pullbacks", href: "/pullbacks" },
  ];

  return (
    <>
      {/* HEADER / LOGO */}
      <header className="px-6 py-4 border-b border-white/10 bg-black/30">
        <Link href="/" className="text-xl font-bold text-gray-200 hover:text-white transition">
          Thermal Trend
        </Link>
      </header>

      {/* TAB NAVIGATION */}
      <nav className="flex gap-6 px-6 py-3 border-b border-white/10 bg-black/20">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`text-sm font-medium ${
              pathname === tab.href
                ? "text-emerald-400 border-b-2 border-emerald-400 pb-1"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </nav>

      {children}
    </>
  );
}
