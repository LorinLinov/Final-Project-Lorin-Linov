import React from 'react';

export default function Register() {
    return (
        <div className="card" style="max-width: 400px; margin: 2rem auto;">
            <h2 className="text-center">Create an Account</h2>
            <form action="catalog.html">
                <div className="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" placeholder="veggie_lover" />
                </div>
                <div className="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" placeholder="farmer@example.com" />
                </div>
                <div className="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="********" />
                </div>
                <div className="form-group">
                    <label for="confirm_password">Confirm Password</label>
                    <input type="password" id="confirm_password" placeholder="********" />
                </div>
                <button type="submit" className="btn" style="width: 100%;">Sign Up</button>
            </form>
            <p className="text-center" style="margin-top: 1.5rem;">
                Already have an account? <a href="login.html" style="color: var(--primary-color);">Login here</a>.
            </p>
        </div>
    );
}