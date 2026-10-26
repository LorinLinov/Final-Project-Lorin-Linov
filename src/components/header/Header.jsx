import React from 'react';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';

// !
export default function Header() {
    const { isAuthenticated } = useAuth();

    return (
        <header>
            <Link to='/' className='logo'><h1>🥦 Veggie Haven</h1></Link>
            <nav>
                <Link to='/'>Home</Link>
                <Link to="/catalog">Catalog</Link>
                {isAuthenticated ?
                    (
                        <div id="user">
                            <Link to="/create">Add Item</Link>
                            <Link to="/logout">Logout</Link>
                        </div>
                    )
                    :
                    (
                        <div id="guest">
                            <Link to="/login">Login</Link>
                            <Link to="/register">Sign Up</Link>
                        </div>
                    )
                }
            </nav>
        </header>
    );
}