import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center gap-6">
      <Link href="/gallery" className="hover:text-gray-300 transition">
        Gallery
      </Link>
      <Link href="/upload" className="hover:text-gray-300 transition">
        Upload
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        className="ml-auto hover:text-gray-300 transition"
      >
        Logout
      </button>
    </nav>
  );
}
