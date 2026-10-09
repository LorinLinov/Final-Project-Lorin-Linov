import React from 'react';

export default function Home() {
    return (
        <>
            <div className="hero">
                <h2>Welcome to Veggie Haven!</h2>
                <p>Your ultimate source for 100% organic, freshly picked vegetables straight from the farm to your table.
                </p>
                <a href="catalog.html" className="btn">Explore Our Catalog</a>
            </div>

            <div className="grid">
                <div className="card text-center">
                    <h3>🌱 Organic Certified</h3>
                    <p>All our vegetables are grown without synthetic pesticides or fertilizers.</p>
                </div>
                <div className="card text-center">
                    <h3>🚜 Local Farmers</h3>
                    <p>We support local agriculture by sourcing directly from community farms.</p>
                </div>
                <div className="card text-center">
                    <h3>🚚 Fast Delivery</h3>
                    <p>Get your healthy greens delivered fresh to your door in no time.</p>
                </div>
            </div>

        </>
    );
}