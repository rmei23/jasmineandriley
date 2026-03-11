import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import Navbar from "../src/components/Navbar";

interface Image {
  id: string;
  filePath: string;
  caption: string | null;
}

function ImageCard({ img }: { img: Image }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        background: 'white',
        boxShadow: isHovered ? '0 20px 40px rgba(0, 0, 0, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ 
        width: '100%', 
        paddingBottom: '100%', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img
          src={img.filePath}
          alt="Gallery image"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.5s ease'
          }}
        />
      </div>
    </div>
  );
}

export default function Gallery() {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    fetch("/api/images/random")
      .then(res => res.json())
      .then(setImages);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #d8b4e8 0%, #b8dce8 100%)'
    }}>
      <Navbar />
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '3rem 1.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #9333ea, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.75rem'
          }}>
            Our Memories
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>A collection of our favorite moments together :)</p>
        </div>

        {images.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{
              width: '96px',
              height: '96px',
              background: 'linear-gradient(to bottom right, #e9d5ff, #dbeafe)',
              borderRadius: '50%',
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg style={{ width: '48px', height: '48px', color: '#c084fc' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>No photos yet</h3>
            <p style={{ color: '#6b7280' }}>Upload your first photo to get started!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {images.map((img) => (
              <ImageCard key={img.id} img={img} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/auth/signin", permanent: false } };
  }
  return { props: {} };
}
