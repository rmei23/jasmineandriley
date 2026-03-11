// pages/auth/signin.tsx
import { getCsrfToken, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

export default function SignIn({ csrfToken }: { csrfToken: string }) {
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
      // Sign-in successful, redirect to gallery page (or wherever)
      router.push("/gallery");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="p-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
          Sign In
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken(context);
  return { props: { csrfToken } };
};
