import React from 'react';
import { Link } from 'react-router';

// !
export default function Header() {
    return (
        <header>
            <Link to='/' className='logo'><h1>🥦 Veggie Haven</h1></Link>
            <nav>
                <Link to='/'>Home</Link>
                <Link to="/catalog">Catalog</Link>
                <Link to="/create">Add Item</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Sign Up</Link>
            </nav>
        </header>
    );
}