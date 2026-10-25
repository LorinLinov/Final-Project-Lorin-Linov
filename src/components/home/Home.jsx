import React from 'react';
import { Link } from 'react-router';
import request from '../../../utils/request';
import { useState, useEffect } from 'react';
import CardElement from '../cardElement/CardElement';

// !
export default function Home() {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        request('/products?order=created_at.desc&limit=3')
            .then(data => setProducts(data))
            .catch(err => console.error('Error fetching products:', err))
    }, ([]))


    return (
        <>
            <div className="hero">
                <h2>Welcome to Veggie Haven!</h2>
                <p>Your ultimate source for 100% organic, freshly picked vegetables straight from the farm to your table.
                </p>
                <Link to="/catalog" className="btn">Explore Our Catalog</Link>
            </div>

            <section className="products-section">
                <h2 className="section-title">Featured Products</h2>
                <div className="products-grid">

                {products.map(product => <CardElement product={product} />)}

                </div>
            </section>

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