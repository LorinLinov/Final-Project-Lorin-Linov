import React from 'react';

export default function Create() {
    return (
        <div className="card" style="max-width: 600px; margin: 0 auto;">
            <h2 className="text-center">Add New Vegetable</h2>
            <form>
                <div className="form-group">
                    <label for="name">Vegetable Name</label>
                    <input type="text" id="name" name="name" placeholder="e.g., Bell Peppers" />
                </div>
                <div className="form-group">
                    <label for="price">Price per unit ($)</label>
                    <input type="number" step="0.01" name="price" id="price" placeholder="e.g., 2.50" />
                </div>
                <div className="form-group">
                    <label for="imageUrl">Image URL</label>
                    <input type="url" id="imageUrl" name="imageUrl" placeholder="https://example.com/image.jpg" />
                </div>
                <div className="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" rows="5" placeholder="Tell your customers about this vegetable..."></textarea>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn" style="width: 100%;">Create Product</button>
                </div>
            </form>
        </div>
    );
}