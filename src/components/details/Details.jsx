import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import request from '../../../utils/request.js';
import { Link } from 'react-router';
import CommentList from '../comments/CommentList.jsx';
import { remove } from '../../api/products-api.js';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth.js';
// !
export default function Details() {
    const { isAuthenticated, user } = useAuth();

    const navigate = useNavigate();

    const id = useParams().id;
    const [product, setProduct] = useState(null);

    const isOwner = user && user?.id === product?.user_id;

    useEffect(() => {
        request(`products?id=eq.${id}`)
            .then(data => setProduct(data[0]));
    }, [id]);

    if (!product) {
        return <div className="card">Product not found</div>;
    }

    const onDelete = async () => {
        const confirm = window.confirm('Are you sure you want to delete this product?');

        if (!confirm) {
            return;
        }

        try {
            await remove(id)
            toast.success('Product deleted successfully');
            navigate('/catalog');
        } catch (error) {
            toast.error('Failed to delete product');
        }


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
            {isAuthenticated ?
                <div>
                    {isOwner ? <div className="detailsBtn">
                        <Link to="/catalog" className="btn btn-secondary">&larr; Back to Catalog</Link>
                        <div className="detailsBtnRight">
                            <Link to={`/edit/${product.id}`} className="btn">Edit Product</Link>
                            <a className="btn" onClick={onDelete}>Delete Product</a>
                        </div>
                    </div> : <div></div>}

                    <CommentList />
                </div>
                :
                <div></div>
            }
        </div>
    );
}