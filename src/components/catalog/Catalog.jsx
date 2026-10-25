import React from 'react';
import CardElement from '../cardElement/CardElement.jsx';
import { useState, useEffect } from 'react';
import request from '../../../utils/request.js';
import { Link } from 'react-router';

export default function Catalog() {

    const [products, setProducts] = useState([])

    useEffect(() => {
        request('/products')
            .then(data => setProducts(data))
            .catch(err => console.error('Error fetching products:', err))
    }, []);

    return (
        <>
            <div className='catalogAdd'>
                <h2 style={{ marginLeft: '2rem' }}>Vegetable Dashboard / Catalog</h2>
                <Link to="/create" className="btn">+ Add New Vegetable</Link>
            </div>

            <div className="grid">
                {products.map(product => (
                    <CardElement key={product.id} product={product} />
                ))}
            </div>
        </>
    );
}