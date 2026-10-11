import React from 'react';

export default function Edit() {
    return (
        <div className="card editCard">
            <h2 className="text-center">Edit Vegetable</h2>
            <form action="catalog.html">
                <div className="form-group">
                    <label for="name">Vegetable Name</label>
                    <input type="text" id="name" value="Red Tomatoes" />
                </div>
                <div className="form-group">
                    <label for="price">Price per unit ($)</label>
                    <input type="number" step="0.01" id="price" value="2.99" />
                </div>
                <div className="form-group">
                    <label for="imageUrl">Image URL</label>
                    <input type="url" id="imageUrl" value="https://example.com/tomato.jpg" />
                </div>
                <div className="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" rows="5">Fresh, juicy, and perfect for your summer salads.</textarea>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn" style="width: 100%;">Save Changes</button>
                </div>
            </form>
        </div>
    );
}