import React from 'react';

export default function Login() {
    return (
        <div className="card" style="max-width: 400px; margin: 2rem auto;">
            <h2 className="text-center">Login</h2>
            <form action="catalog.html">
                <div className="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" placeholder="farmer@example.com" />
                </div>
                <div className="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="********" />
                </div>
                <button type="submit" className="btn" style="width: 100%;">Sign In</button>
            </form>
            <p className="text-center" style="margin-top: 1.5rem;">
                Don't have an account? <a href="register.html" style="color: var(--primary-color);">Sign up here</a>.
            </p>
        </div>
    );
}