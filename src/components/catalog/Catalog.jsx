import React from 'react';
import CardElement from '../cardElement/CardElement.jsx';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getAll } from '../../api/products-api.js';

export default function Catalog() {

    const [products, setProducts] = useState([])

    useEffect(() => {
        getAll('/products')
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