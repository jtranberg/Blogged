"use client"; // Ensure this is a client-side component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/CreatePost.css'; // Adjust path if needed


export default function CreatePostPage() {
  const [title, setTitle] = useState<string>(''); // Ensure title is a string
  const [content, setContent] = useState<string>(''); // Ensure content is a string
  const [image, setImage] = useState<string>(''); // Ensure image is a string
  const [error, setError] = useState<string | null>(null); // Allow error to be a string or null
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a post.');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send token for authentication
        },
        body: JSON.stringify({ title, content, image }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error creating post: ${errorText}`);
      }

      // If the post is created successfully, navigate back to the blog page
      router.push('/blog');
    } catch (err) {
      // Error handling: check if err is an instance of Error and access message
      if (err instanceof Error) {
        console.error('Error creating post:', err.message);
        setError(err.message); // Set error message in the state
      } else {
        console.error('Unknown error:', err);
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
        <label>
          Image URL:
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>
        <button type="submit">Create Post</button>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
      </form>
    </div>
  );
}
