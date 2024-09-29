"use client"; // Ensure this is a client-side component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/MyPosts.css'; // Import the CSS file
import '../styles/Header.css'; // Ensure the header styles are included



interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch user posts');
        }
        return response.json();
      })
      .then((data) => {
        if (!data.posts || data.posts.length === 0) {
          setError('No posts found.');
        } else {
          setPosts(data.posts);
        }
      })
      .catch((err) => {
        console.error('Error fetching user posts:', err);
        setError('Error fetching user posts. Please try again later.');
      });
  }, [router]);

  return (
    <div className="my-posts-page">
      
      <div className="my-posts-container">
        <h1 className="my-posts-header">My Posts</h1>
        {error ? (
          <p className="my-posts-error">Error: {error}</p>
        ) : (
          <ul className="my-posts-list">
            {posts.map((post) => (
              <li key={post._id} className="my-posts-list-item">
                <h2 className="my-posts-title">{post.title}</h2>
                <p className="my-posts-content">{post.content}</p>
                <small className="my-posts-date">{new Date(post.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
