import React from 'react';
import { Link } from 'react-router';

export default function Error() {
    return (
        <div>
            <div className="text-center card" style={{ maxWidth: '600px', margin: '4rem auto', padding: '4rem 2rem' }}>
                <h1 style={{ fontSize: '4rem', margin: 0, color: 'var(--primary-dark)' }}>404</h1>
                <h2>Page Not Found</h2>
                <p style={{marginBottom: '2rem'}}>Oops! Looks like this vegetable was already harvested or the page doesn't exist.</p>
                <Link to="/" className="btn">Return to Home</Link>
            </div>
        </div>
    );
}