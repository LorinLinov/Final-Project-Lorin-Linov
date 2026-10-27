import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import request from '../../../utils/request.js';
import { toast } from 'react-toastify';
import { update } from '../../api/products-api.js';

const initialValues = {
    product_name: '',
    price: 0,
    imageURL: '',
    description: '',
    category: '',
    farm: '',
    inStock: 0
}

export default function Edit() {
    const navigate = useNavigate()
    const { id } = useParams();
    const [product, setProduct] = useState(initialValues);

    useEffect(() => {
        request(`products?id=eq.${id}`, 'GET').then(data => {
            setProduct(data[0]);
        });
    }, [id]);

    const blockInvalidKeys = (e) => {
        if (['-', '+', 'e', 'E'].includes(e.key)) {
            e.preventDefault();
        }
    };

    const changeHadler = (e) => {
        setProduct(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    const editAction = async () => {
        if (!product.product_name || !product.price || !product.imageURL || !product.description || !product.category || !product.farm || !product.inStock) {
            return toast.error('All fields are required!')
        }
        try {
            await update(product, id)
            toast.success('Product was edited succesfully!')
            navigate(`/details/${id}`)
        } catch (error) {
            toast.error(error.message)
        }
    }


    if (!product) {
        return <div className="card">Product not found</div>;
    }

    return (
        <div className="card editCard">
            <h2 className="text-center">Edit Vegetable</h2>
            <form action={editAction}>
                <div className="form-group">
                    <label htmlFor="name">Vegetable Name</label>
                    <input type="text" id="name" name='product_name' value={product.product_name} onChange={changeHadler} />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price per unit ($)</label>
                    <input type="number"  min="0" step="0.01" id="price" name='price' value={product.price} onKeyDown={blockInvalidKeys} onChange={changeHadler} />
                </div>
                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL</label>
                    <input type="url" id="imageUrl" name='imageURL' value={product.imageURL} onChange={changeHadler} />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" rows="5" name='description' value={product.description} onChange={changeHadler}></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input type="text" id="category" name="category" value={product.category} onChange={changeHadler} placeholder="e.g., Vegetables" />
                </div>
                <div className="form-group">
                    <label htmlFor="farm">Farm</label>
                    <input type="text" id="farm" name="farm" value={product.farm} onChange={changeHadler} placeholder="e.g., Green Acres" />
                </div>
                <div className="form-group">
                    <label htmlFor="inStock">In Stock (kg)</label>
                    <input type="number" id="inStock" name="inStock" value={product.inStock} onKeyDown={blockInvalidKeys} onChange={changeHadler} min="0" step="1" placeholder="e.g., 10" />
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btnWidth" >Save Changes</button>
                </div>
            </form>
        </div>
    );
}