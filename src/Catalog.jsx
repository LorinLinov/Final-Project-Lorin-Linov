import React from 'react';

export default function Catalog() {
    return (
        <>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2>Vegetable Dashboard / Catalog</h2>
                <a href="create.html" className="btn">+ Add New Vegetable</a>
            </div>

            <div className="grid">
                <div className="card product-card">
                    <img src="images/red-tomatoes-on-the-vine_variety-page.png" alt="Red Tomatoes" className="product-image" />
                    <h3>🍅 Red Tomatoes</h3>
                    <p>Fresh, juicy, and perfect for your summer salads.</p>
                    <p className="price">$2.99 / kg</p>
                    <div className="product-actions">
                        <a href="details.html" className="btn btn-secondary">Details</a>
                        <a href="edit.html" className="btn">Edit</a>
                    </div>
                </div>

                <div className="card product-card">
                    <img src="images/cucumber_grande.webp" alt="Crisp Cucumbers" className="product-image" />
                    <h3>🥒 Crisp Cucumbers</h3>
                    <p>Hydrating and crunchy, great for pickling or eating raw.</p>
                    <p className="price">$1.49 / kg</p>
                    <div className="product-actions">
                        <a href="details.html" className="btn btn-secondary">Details</a>
                        <a href="edit.html" className="btn">Edit</a>
                    </div>
                </div>

                <div className="card product-card">
                    <img src="images/carrots.jpg" alt="Organic Carrots" className="product-image" />
                    <h3>🥕 Organic Carrots</h3>
                    <p>Sweet, earthy, and rich in Vitamin A.</p>
                    <p className="price">$1.99 / bunch</p>
                    <div className="product-actions">
                        <a href="details.html" className="btn btn-secondary">Details</a>
                        <a href="edit.html" className="btn">Edit</a>
                    </div>
                </div>
            </div>
        </>
    );
}