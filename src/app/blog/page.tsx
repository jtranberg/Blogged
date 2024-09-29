"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../styles/Blog.css'; // Ensure Blog CSS is imported

type Post = {
    _id: string;
    title: string;
    content: string;
    image?: string;  // Optional image field
};

export default function BlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch posts
    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!token) {
                setError('You must be logged in to view the posts.');
                router.push('/login');
                return;
            }

            try {
                const res = await fetch('/api/posts', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Error fetching posts: ${res.statusText}`);
                }

                const data = await res.json();
                setPosts(data.posts);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [router]);

    if (loading) {
        return <p>Loading posts...</p>;
    }

    if (error) {
        return <p>Error loading posts: {error}</p>;
    }

    return (
        <main className="main-container">
           
            <div className="posts-container">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className="post">
                            <h2>{post.title}</h2>
                            {/* Use Next.js Image component for optimized image loading */}
                            {post.image && (
                                <Image 
                                    src={post.image} 
                                    alt={post.title} 
                                    width={600} 
                                    height={400} 
                                    className="post-image"
                                    priority
                                />
                            )}
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
            </div>
        </main>
    );
}
