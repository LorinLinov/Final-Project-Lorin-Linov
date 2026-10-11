import React from 'react';

export default function Error() {
    return (
        <div>
            <div class="text-center card" style="max-width: 600px; margin: 4rem auto; padding: 4rem 2rem;">
                <h1 style="font-size: 4rem; margin: 0; color: var(--primary-dark);">404</h1>
                <h2>Page Not Found</h2>
                <p style="margin-bottom: 2rem;">Oops! Looks like this vegetable was already harvested or the page doesn't exist.</p>
                <a href="index.html" className="btn">Return to Home</a>
            </div>
        </div>
    );
}