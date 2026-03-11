import { useState } from "react";
import { getServerSession } from "next-auth";
import Navbar from "../src/components/Navbar";
import { useRouter } from "next/router";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/images/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);
    if (res.ok) {
      router.push("/gallery");
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #d8b4e8 0%, #b8dce8 100%)'
    }}>
      <Navbar />
      <div style={{
        maxWidth: '672px',
        margin: '0 auto',
        padding: '3rem 1.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #9333ea, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            Upload a Memory
          </h1>
          <p style={{ color: '#6b7280' }}>Add to our collection!</p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.75rem'
            }}>
              Choose Photo
            </label>
            
            {!preview ? (
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '256px',
                border: '3px dashed #c084fc',
                borderRadius: '16px',
                cursor: 'pointer',
                background: 'linear-gradient(to bottom right, #faf5ff, #eff6ff)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(to bottom right, #f3e8ff, #dbeafe)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(to bottom right, #faf5ff, #eff6ff)'}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.25rem 1.5rem'
                }}>
                  <svg style={{ width: '64px', height: '64px', marginBottom: '1rem', color: '#c084fc' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Click to upload</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  required
                />
              </label>
            ) : (
              <div style={{ position: 'relative' }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '256px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
                >
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            style={{
              width: '100%',
              background: (uploading || !file) ? 'linear-gradient(to right, #d1d5db, #9ca3af)' : 'linear-gradient(to right, #a855f7, #3b82f6)',
              color: 'white',
              fontWeight: '600',
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              cursor: (uploading || !file) ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (!uploading && file) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.5)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(168, 85, 247, 0.4)';
            }}
          >
            {uploading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <svg style={{ animation: 'spin 1s linear infinite', height: '20px', width: '20px' }} fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload to Gallery"
            )}
          </button>
        </form>
      </div>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/auth/signin", permanent: false } };
  }
  return { props: {} };
}
