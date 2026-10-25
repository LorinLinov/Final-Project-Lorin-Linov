import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import request from '../../../utils/request.js';
import { Link } from 'react-router';
import CommentList from '../comments/CommentList.jsx';
// !
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

    const onDelete = (e) => {
        alert('Are you sure you want to delete this product?');
        e.preventDefault();
        
        request(`products?id=eq.${id}`, 'DELETE')
            .then(() => {
                alert('Product deleted successfully');
                window.location.href = '/catalog';
            })
            .catch(err => {
                console.error(err);
                alert('Failed to delete product');
            });
    };

    return (
        <div className="card detailsCard">
            <div className="detailsHeader">
                <img src={product.imageURL} alt={product.product_name} className="detailsImage" />
                <div className="detailsInfo">
                    <h2 className="productName">{product.product_name}</h2>
                    <p className="price detailsPrice" >{product.price.toFixed(2)}€ / kg</p>

                    <hr className="hrDetails" />

                    <h3>Description</h3>
                    <p>{product.description}</p>

                    <h3>Details</h3>
                    <ul type="none" className="detailsList">
                        <li><strong>Category:</strong> {product.category}</li>
                        <li><strong>Farm:</strong> {product.farm}</li>
                        <li><strong>In Stock:</strong> Yes ({product.inStock} kg available)</li>
                    </ul>
                </div>
            </div>
            <div className="detailsBtn">
                <Link to="/catalog" className="btn btn-secondary">&larr; Back to Catalog</Link>
                <div className="detailsBtnRight">
                    <Link to={`/edit/${product.id}`} className="btn">Edit Product</Link>
                    <Link to={`/delete/${product.id}`} className="btn" onClick={onDelete}>Delete Product</Link>
                </div>
            </div>
            <CommentList />
        </div>
    );
}