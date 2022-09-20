import { NavLink } from "@remix-run/react";

export default function Navbar() {
  return (
    <nav className="bg-zinc-800 px-6 text-white">
      <ul className="mb-4 flex">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block border border-l border-r border-zinc-900 py-4 px-4 ${
                isActive && "bg-zinc-700 hover:bg-zinc-600"
              }`
            }
          >
            Dashboard
          </NavLink>
        </li>
        {/* PLOP MARKER - DO NOT DELETE */}
      </ul>
    </nav>
  );
}
