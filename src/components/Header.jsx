import React from 'react';
import { Link } from 'react-router';

export default function Header() {
    return (
        <header>
            <Link to='/' className='logo'><h1>🥦 Veggie Haven</h1></Link>
            <nav>
                <Link to='/'>Home</Link>
                <Link to="/catalog">Catalog</Link>
                <a href="/create">Add Item</a>
                <a href="/login">Login</a>
                <a href="/register">Sign Up</a>
            </nav>
        </header>
    );
}