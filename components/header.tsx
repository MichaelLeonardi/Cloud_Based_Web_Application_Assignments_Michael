"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header({ studentNumber }: { studentNumber: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const links = [
    { href: "/", label: "Tabs" },
    { href: "/about", label: "About" },
    { href: "/escapeRoom", label: "Escape Room" },
    { href: "/codingraces", label: "Coding Races" },
    { href: "/courtroom", label: "Court Room" },
  ];

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          background: "var(--header-bg)",
          borderBottom: "1px solid var(--border-color)",
          boxShadow: "var(--shadow)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(8px)",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: "var(--foreground)",
            letterSpacing: 0.4,
          }}
        >
           LTU Student ID:{22586733}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: "6px 12px",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              background: "transparent",
              color: "var(--foreground)",
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.25s ease",
            }}
            onMouseOver={(e) => {
              (e.target as HTMLElement).style.background = "var(--accent)";
              (e.target as HTMLElement).style.color = "#fff";
            }}
            onMouseOut={(e) => {
              (e.target as HTMLElement).style.background = "transparent";
              (e.target as HTMLElement).style.color = "var(--foreground)";
            }}
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>

          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((s) => !s)}
            style={{
              width: 36,
              height: 30,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 4,
              transition: "opacity 0.2s ease",
            }}
          >
            <span
              style={{
                height: 3,
                width: "100%",
                borderRadius: 2,
                background: "var(--foreground)",
                transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
                transition: "transform 0.25s ease",
              }}
            />
            <span
              style={{
                height: 3,
                width: "100%",
                borderRadius: 2,
                background: "var(--foreground)",
                opacity: menuOpen ? 0 : 1,
                transition: "opacity 0.2s ease",
              }}
            />
            <span
              style={{
                height: 3,
                width: "100%",
                borderRadius: 2,
                background: "var(--foreground)",
                transform: menuOpen
                  ? "translateY(-6px) rotate(-45deg)"
                  : "none",
                transition: "transform 0.25s ease",
              }}
            />
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav
          className="fade-in"
          style={{
            padding: "12px 20px",
            background: "var(--header-bg)",
            borderBottom: "1px solid var(--border-color)",
            boxShadow: "var(--shadow)",
            backdropFilter: "blur(6px)",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <ul
            style={{
              display: "flex",
              gap: 20,
              listStyle: "none",
              margin: 0,
              padding: 0,
              flexWrap: "wrap",
            }}
          >
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    color: "var(--foreground)",
                    textDecoration: "none",
                    fontWeight: pathname === link.href ? 700 : 500,
                    borderBottom:
                      pathname === link.href
                        ? `2px solid ${
                            theme === "dark" ? "#fff" : "#000"
                          }`
                        : "2px solid transparent",
                    paddingBottom: 3,
                    transition: "all 0.3s ease",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
