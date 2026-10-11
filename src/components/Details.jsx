import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import request from '../../utils/request.js';
import {Link} from 'react-router';

export default function Details() {

    const id = useParams().id;
    const [product, setProduct] = useState(null);

    useEffect(() => {
        request(`products?id=eq.${id}`)
            .then(data => setProduct(data[0]));
    }, [id]);

    if (!product) {
        return <div className="card">Product not found</div>;
    }

    return (
        <div className="card detailsCard">
            <div className="detailsHeader">
                <div>
                    <h2 className="productName">{product.product_name}</h2>
                    <p className="price detailsPrice" >${product.price.toFixed(2)} / kg</p>
                </div>
                <Link to={`/edit/${product.id}`} className="btn">Edit Product</Link>
            </div>

            <hr className="hrDetails" />

            <h3>Description</h3>
            <p>{product.description}</p>

            <h3>Details</h3>
            <ul>
                <li><strong>Category:</strong> {product.category}</li>
                <li><strong>Farm:</strong> {product.farm}</li>
                <li><strong>In Stock:</strong> Yes ({product.inStock} kg available)</li>
            </ul>

            <div className="detailsBtn">
                <Link to="/catalog" className="btn btn-secondary">&larr; Back to Catalog</Link>
            </div>
        </div>
    );
}