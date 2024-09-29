"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/LoginPage.css'; // Ensure the correct path
import '../styles/Register.css'; // Ensure the correct path

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Error handling
    const router = useRouter();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        console.log("Sending credentials:", { username, password });

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            const { token } = await res.json();
            console.log('Login successful, received token:', token);
            localStorage.setItem('token', token);
            router.push('/blog');
        } else {
            const { error } = await res.json();
            console.error('Login failed:', error);
            setErrorMessage(error || 'Login failed. Please try again.');
        }
    };

    const handleRegisterRedirect = () => {
        router.push('/register');
    };

    return (
        <main className="main-container">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <div>
                        <button type="submit" className="submit-btn">
                            Sign In
                        </button>
                    </div>
                </form>

                {/* Register link */}
                <p className="register-text">
                    Don&apos;t have an account?{' '}
                    <button onClick={handleRegisterRedirect} className="link-button">
                        Register here
                    </button>
                </p>
            </div>
        </main>
    );
}
