import React from 'react';
import { Link } from 'react-router';

export default function Register() {
    return (
        <div className="card enter">
            <h2 className="text-center">Create an Account</h2>
            <form action="catalog.html">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" placeholder="veggie_lover" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" placeholder="farmer@example.com" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="********" />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm_password">Confirm Password</label>
                    <input type="password" id="confirm_password" placeholder="********" />
                </div>
                <button type="submit" className="btn btnWidth">Sign Up</button>
            </form>
            <p className="text-center marginTextEnter">
                Already have an account? <Link to="/login" className="enterBtn">Login here</Link>.
            </p>
        </div>
    );
}