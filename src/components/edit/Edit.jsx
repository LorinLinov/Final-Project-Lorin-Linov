import React from 'react';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import request from '../../../utils/request.js';

// !
export default function Edit() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    const changeHandler=(e)=>{
        
    }

    if (!product) {
        return <div className="card">Product not found</div>;
    }

    return (
        <div className="card editCard">
            <h2 className="text-center">Edit Vegetable</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Vegetable Name</label>
                    <input type="text" id="name" defaultValue={product.product_name} />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price per unit ($)</label>
                    <input type="number" step="0.01" id="price" defaultValue={product.price} />
                </div>
                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL</label>
                    <input type="url" id="imageUrl" defaultValue={product.imageURL} />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" rows="5" defaultValue={product.description}></textarea>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btnWidth" >Save Changes</button>
                </div>
            </form>
        </div>
    );
}