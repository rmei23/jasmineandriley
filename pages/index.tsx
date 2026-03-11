// pages/index.tsx
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome back!</h1>
      <p>You're logged in. Go explore the app.</p>
    </div>
  );
}

// Server-side redirect for unauthenticated users
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false
      }
    };
  }

  // Optional: check if user is new and redirect to onboarding
  // const prisma = new PrismaClient();
  // const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  // if (user && user.isNew) {
  //   return { redirect: { destination: "/welcome", permanent: false } };
  // }

  return { props: {} };
};

