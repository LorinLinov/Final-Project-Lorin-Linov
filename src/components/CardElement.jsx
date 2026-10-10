import React from 'react';

export default function CardElement({ product }) {
    return (
        <div className="card product-card">
            <img src={product.imageURL} alt={product.product_name} className="product-image" />
            <h3>{product.product_name}</h3>
            <p>{product.description}</p>
            <p className="price">${product.price.toFixed(2)} / kg</p>
            <div className="product-actions">
                <a href={`details/${product.id}`} className="btn btn-secondary">Details</a>
                <a href={`edit/${product.id}`} className="btn">Edit</a>
            </div>
        </div>
    );
}