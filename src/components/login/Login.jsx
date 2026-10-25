import React from 'react';
import { Link } from 'react-router';

export default function Login() {
    return (
        <div className="card enter" >
            <h2 className="text-center">Login</h2>
            <form action="catalog.html">
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" placeholder="farmer@example.com" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="********" />
                </div>
                <button type="submit" className="btn btnWidth">Sign In</button>
            </form>
            <p className="text-center marginTextEnter">
                Don't have an account? <Link to="/register" className="enterBtn">Sign up here</Link>.
            </p>
        </div>
    );
}