import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <nav style={{
      background: '#F0DAED',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <Link 
            href="/gallery"
            style={{
              color: hoveredLink === 'gallery' ? '#9333ea' : '#374151',
              fontWeight: '600',
              fontSize: '1.15rem',
              textDecoration: 'none',
              transition: 'all 0.2s',
              borderBottom: hoveredLink === 'gallery' ? '2px solid #9333ea' : '2px solid transparent',
              paddingBottom: '4px'
            }}
            onMouseEnter={() => setHoveredLink('gallery')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Photos
          </Link>
          <Link 
            href="/upload"
            style={{
              color: hoveredLink === 'upload' ? '#9333ea' : '#374151',
              fontWeight: '600',
              fontSize: '1.15rem',
              textDecoration: 'none',
              transition: 'all 0.2s',
              borderBottom: hoveredLink === 'upload' ? '2px solid #9333ea' : '2px solid transparent',
              paddingBottom: '4px'
            }}
            onMouseEnter={() => setHoveredLink('upload')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Upload
          </Link>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          style={{
            padding: '0.5rem 1rem',
            color: hoveredLink === 'logout' ? '#9333ea' : '#374151',
            fontWeight: '600',
            fontSize: '1.05rem',
            background: 'none',
            border: 'none',
            borderBottom: hoveredLink === 'logout' ? '2px solid #9333ea' : '2px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.2s',
            paddingBottom: '4px'
          }}
          onMouseEnter={() => setHoveredLink('logout')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
