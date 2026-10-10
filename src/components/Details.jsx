import React from 'react';

export default function Details() {
    return (
        <div className="card" style="max-width: 800px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h2 style="margin-top: 0;">🍅 Red Tomatoes</h2>
                    <p className="price" style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">$2.99 / kg</p>
                </div>
                <a href="edit.html" className="btn">Edit Product</a>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 1.5rem 0;" />

                <h3>Description</h3>
                <p>Fresh, juicy, and perfect for your summer salads. Our red tomatoes are grown locally without any artificial pesticides. They are hand-picked at peak ripeness to ensure the best flavor and nutritional value.</p>

                <h3>Details</h3>
                <ul>
                    <li><strong>Category:</strong> Vegetables</li>
                    <li><strong>Farm:</strong> Sunny Valley Farms</li>
                    <li><strong>In Stock:</strong> Yes (45 kg available)</li>
                </ul>

                <div style="margin-top: 2rem;">
                    <a href="catalog.html" className="btn btn-secondary">&larr; Back to Catalog</a>
                </div>
        </div>
    );
}