"use client";

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    console.log("Login button clicked, redirecting to /login...");
    router.push('/login'); // Redirect to login page
  };

  return (
    <div className="mainDiv">
      <h1 className="greeting">Welcome to  Blogged</h1>
      <p className="openingParagraph">Free speach ahead.</p>
      <button
        className="buttonMain"
        onClick={handleLoginRedirect} // Ensure event fires
      >
        Go to Login
      </button>
    </div>
  );
}
