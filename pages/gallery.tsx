import { useEffect, useState, useRef, useCallback } from "react";
import { getSession } from "next-auth/react";
import Navbar from "../src/components/Navbar";

interface Image {
  id: string;
  filePath: string;
  caption: string | null;
}

function ImageCard({ img, index }: { img: Image; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Create varied spacing for disjointed look
  const spacingVariants = ['0.8rem', '1.2rem', '1.6rem', '2rem', '1rem'];
  const marginBottom = spacingVariants[index % spacingVariants.length];

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        background: 'white',
        boxShadow: isHovered ? '0 16px 32px rgba(0, 0, 0, 0.12)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isLoaded ? 1 : 0,
        breakInside: 'avoid',
        marginBottom: marginBottom,
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={img.filePath}
        alt="Gallery image"
        onLoad={() => setIsLoaded(true)}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
    </div>
  );
}

export default function Gallery() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadImages = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const url = cursor 
        ? `/api/images/paginated?cursor=${cursor}&limit=20`
        : `/api/images/paginated?limit=20`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      setImages(prev => [...prev, ...data.images]);
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, hasMore]);

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadImages();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, loading, loadImages]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #d8b4e8 0%, #b8dce8 100%)'
    }}>
      <Navbar />
      <div style={{
        width: '90%',
        margin: '0 auto',
        padding: '2rem 0'
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

        {images.length === 0 && !loading ? (
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
          <>
            <div style={{
              columnCount: 4,
              columnGap: '2rem'
            }}>
              {images.map((img, index) => (
                <ImageCard key={img.id} img={img} index={index} />
              ))}
            </div>
            
            {loading && (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#9333ea',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '-0.32s'
                }}></div>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#9333ea',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '-0.16s'
                }}></div>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#9333ea',
                  animation: 'bounce 1.4s infinite ease-in-out both'
                }}></div>
              </div>
            )}
            
            <div ref={loadMoreRef} style={{ height: '20px' }} />
          </>
        )}
      </div>
      
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        @media (max-width: 1200px) {
          div[style*="columnCount"] {
            column-count: 3 !important;
          }
        }
        
        @media (max-width: 768px) {
          div[style*="columnCount"] {
            column-count: 2 !important;
          }
        }
        
        @media (max-width: 480px) {
          div[style*="columnCount"] {
            column-count: 1 !important;
          }
        }
      `}</style>
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
