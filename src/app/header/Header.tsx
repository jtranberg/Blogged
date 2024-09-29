"use client"; // Ensure this is a client-side component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/Header.css'; // Style the header accordingly

export default function Header() {
  const [loading, setLoading] = useState(true); // Loading state to avoid premature redirects
  const [showAllPosts, setShowAllPosts] = useState(true); // Track whether to show all posts or user posts
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [menuOpen, setMenuOpen] = useState(false); // State to track if the menu is open (for mobile)
  const router = useRouter();

  // Check for token when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
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
    if (!token) {
      router.push('/login');
      return;
    }

    if (showAllPosts) {
      router.push('/my-posts');
    } else {
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

  // Toggle the mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the state
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking for token
  }

  return (
    <header className="header-container">
      <div className="logo">
        <h1>My Blog</h1>
      </div>
      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className="hamburger-icon"></div>
      </div>
      <nav className={`nav-container ${menuOpen ? 'open' : ''}`}>
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
