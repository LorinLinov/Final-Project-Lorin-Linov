import React from 'react';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';


export default function Login() {
    const { login } = useAuth();

    const loginAction = (formData) => {

        const { email, password } = Object.fromEntries(formData);

        if (!email || !password) {
            return toast.error('All fields are required!');
        }

        login({ email, password })
    }



    return (
        <div className="card enter" >
            <h2 className="text-center">Login</h2>
            <form action={loginAction}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name='email' placeholder="farmer@example.com" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name='password' placeholder="********" />
                </div>
                <button type="submit" className="btn btnWidth">Sign In</button>
            </form>
            <p className="text-center marginTextEnter">
                Don't have an account? <Link to="/register" className="enterBtn">Sign up here</Link>.
            </p>
        </div>
    );
}