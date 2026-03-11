// pages/auth/signin.tsx
import { getCsrfToken, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

export default function SignIn({ csrfToken }: { csrfToken?: string | null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/gallery");
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #d8b4e8 0%, #b8dce8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      margin: 0
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        padding: '2rem',
        width: '100%',
        maxWidth: '420px'
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
            Hi baby!
          </h1>
          <p style={{ color: '#6b7280' }}>Is it really you :o</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {csrfToken && <input name="csrfToken" type="hidden" defaultValue={csrfToken} />}
          
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                outline: 'none',
                fontSize: '1rem',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#a855f7'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                outline: 'none',
                fontSize: '1rem',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#a855f7'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '2px solid #fecaca',
              color: '#b91c1c',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(to right, #a855f7, #3b82f6)',
              color: 'white',
              fontWeight: '600',
              padding: '0.875rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(168, 85, 247, 0.4)';
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken(context);
  return { props: { csrfToken: csrfToken || null } };
};
