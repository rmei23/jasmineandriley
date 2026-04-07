import { useState } from "react";
import { getServerSession } from "next-auth";
import Navbar from "../src/components/Navbar";
import { useRouter } from "next/router";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Upload() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    
    const newPreviews: string[] = [];
    selectedFiles.forEach((file) => {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      // HEIC files can't be previewed in browser, show placeholder
      if (fileExt === 'heic' || fileExt === 'heif') {
        newPreviews.push('heic-placeholder');
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === selectedFiles.length) {
            setPreviews([...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Set previews immediately for HEIC files
    if (selectedFiles.every(f => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ext === 'heic' || ext === 'heif';
    })) {
      setPreviews(newPreviews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });
    
    let successCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);

      try {
        const res = await fetch("/api/images/upload", {
          method: "POST",
          body: formData,
        });
        
        if (res.ok) {
          successCount++;
        }
      } catch (error) {
        console.error(`Failed to upload ${files[i].name}:`, error);
      }
      
      setUploadProgress({ current: i + 1, total: files.length });
    }

    setUploading(false);
    if (successCount > 0) {
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
              Choose Photos
            </label>
            
            {files.length === 0 ? (
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
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>PNG, JPG, GIF, HEIC</p>
                </div>
                <input
                  type="file"
                  accept="image/*,.heic,.heif"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  multiple
                  required
                />
              </label>
            ) : (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  {files.map((file, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      {previews[index] === 'heic-placeholder' ? (
                        <div style={{
                          width: '100%',
                          height: '150px',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          background: 'linear-gradient(to bottom right, #e9d5ff, #dbeafe)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.5rem'
                        }}>
                          <svg style={{ width: '32px', height: '32px', color: '#9333ea', marginBottom: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p style={{ fontSize: '0.7rem', color: '#6b7280', textAlign: 'center', wordBreak: 'break-word' }}>{file.name}</p>
                        </div>
                      ) : (
                        <img
                          src={previews[index] || ''}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFiles([]);
                    setPreviews([]);
                  }}
                  style={{
                    background: '#f8b4c4',
                    color: '#7d3344',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '2px solid rgba(125, 51, 68, 0.2)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f5a3b5'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#f8b4c4'}
                >
                  Clear All ({files.length})
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading || files.length === 0}
            style={{
              width: '100%',
              background: (uploading || files.length === 0) ? 'linear-gradient(to right, #d1d5db, #9ca3af)' : 'linear-gradient(to right, #a855f7, #3b82f6)',
              color: 'white',
              fontWeight: '600',
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              cursor: (uploading || files.length === 0) ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (!uploading && files.length > 0) {
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
                Uploading {uploadProgress.current}/{uploadProgress.total}...
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
