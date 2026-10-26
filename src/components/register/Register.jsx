import React from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

export default function Register() {
    const { register } = useAuth();

    const registerAction = (formData) => {
        const { username, email, password, confirm_password } = Object.fromEntries(formData);

        if (password !== confirm_password) {
            toast.error('Passwords don\'t match.')
            return;
        }

        if (!username || !email || !password || !confirm_password) {
            toast.error("All fields are required!")
        }

        try {
            register({ email, password });
        } catch (error) {
            console.log(error.message)
        }
        
    }

    return (
        <div className="card enter">
            <h2 className="text-center">Create an Account</h2>
            <form action={registerAction}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name='username' placeholder="veggie_lover" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name='email' placeholder="farmer@example.com" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name='password' placeholder="********" />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm_password">Confirm Password</label>
                    <input type="password" id="confirm_password" name='confirm_password' placeholder="********" />
                </div>
                <button type="submit" className="btn btnWidth">Sign Up</button>
            </form>
            <p className="text-center marginTextEnter">
                Already have an account? <Link to="/login" className="enterBtn">Login here</Link>.
            </p>
        </div>
    );
}