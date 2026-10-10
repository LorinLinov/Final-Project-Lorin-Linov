import React from 'react';
import CardElement from './cardElement.jsx';
import { useState, useEffect } from 'react';
import request from '../../utils/request.js';

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
                <h2>Vegetable Dashboard / Catalog</h2>
                <a href="create.html" className="btn">+ Add New Vegetable</a>
            </div>

            <div className="grid">
                {products.map(product => (
                    <CardElement key={product.id} product={product} />
                ))}
            </div>
        </>
    );
}