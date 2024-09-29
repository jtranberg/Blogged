"use client"; // Ensure this is a client-side component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/Header.css'; // Style the header accordingly

export default function Header() {
  const [loading, setLoading] = useState(true); // Loading state to avoid premature redirects
  const [showAllPosts, setShowAllPosts] = useState(true); // Track whether to show all posts or user posts
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const router = useRouter();

  // Check for token when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token on mount: ", token); // Log the token for debugging

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    setLoading(false); // Loading is complete
  }, []); // Only run on mount

  // Function to toggle between all posts and user-specific posts
  const togglePosts = () => {
    const token = localStorage.getItem('token');
    console.log("Token before toggling posts: ", token); // Log token before toggling

    if (!token) {
      console.log("No token found. Redirecting to login...");
      router.push('/login');
      return;
    }

    if (showAllPosts) {
      console.log("Navigating to user posts...");
      router.push('/my-posts');
    } else {
      console.log("Navigating to all posts...");
      router.push('/blog');
    }

    setShowAllPosts(!showAllPosts); // Toggle between all posts and user posts
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleCreatePost = () => {
    router.push('/create-post');
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token on logout
    setIsLoggedIn(false); // Mark as logged out
    router.push('/login'); // Redirect to login
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking for token
  }

  return (
    <header className="header-container">
      <div className="logo">
        <h1>My Blog</h1>
      </div>
      <nav className="nav-container">
        {isLoggedIn ? (
          <>
            <button onClick={handleCreatePost} className="nav-btn">Create New Post</button>
            <button onClick={togglePosts} className="nav-btn">
              {showAllPosts ? 'Show My Posts' : 'Show All Posts'}
            </button>
            <button onClick={handleLogout} className="nav-btn">Logout</button>
          </>
        ) : (
          <button onClick={handleLogin} className="nav-btn">Login</button>
        )}
      </nav>
    </header>
  );
}
