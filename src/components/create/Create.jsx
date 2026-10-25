import React from 'react';
import request from '../../../utils/request.js';
import { useNavigate } from 'react-router';

// !
export default function Create() {
    const navigate = useNavigate();
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

        navigate('/catalog');
    }

    return (
        <div className="card create" onSubmit={handleSubmit}>
            <h2 className="text-center">Add New Vegetable</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="name">Vegetable Name</label>
                    <input type="text" id="name" name="product_name" placeholder="e.g., Bell Peppers" />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price per unit (€)</label>
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
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input type="text" id="category" name="category" placeholder="e.g., Vegetables" />
                </div>
                <div className="form-group">
                    <label htmlFor="farm">Farm</label>
                    <input type="text" id="farm" name="farm" placeholder="e.g., Green Acres" />
                </div>
                <div className="form-group">
                    <label htmlFor="inStock">In Stock (kg)</label>
                    <input type="number" id="inStock" name="inStock" min="0" step="1" placeholder="e.g., 10" />
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