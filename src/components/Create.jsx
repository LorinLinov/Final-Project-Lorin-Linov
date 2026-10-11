import React from 'react';
import request from '../../utils/request.js';

export default function Create() {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.price = Number(data.price);

        try {
            await request('/products', 'POST', data,);
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    return (
        <div className="card crete" onSubmit={handleSubmit}>
            <h2 className="text-center">Add New Vegetable</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="name">Vegetable Name</label>
                    <input type="text" id="name" name="product_name" placeholder="e.g., Bell Peppers" />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price per unit ($)</label>
                    <input type="number" step="0.01" name="price" id="price" placeholder="e.g., 2.50" />
                </div>
                <div className="form-group">
                    <label htmlFor="imageURL">Image URL</label>
                    <input type="url" id="imageURL" name="imageURL" placeholder="https://example.com/image.jpg" />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" rows="5" placeholder="Tell your customers about this vegetable..."></textarea>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btnWidth">
                        Create Product
                    </button>
                </div>
            </form>
        </div>
    );
}