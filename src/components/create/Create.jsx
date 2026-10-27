import React, { useState } from 'react';
import request from '../../../utils/request.js';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { create } from '../../api/products-api.js';

const initialValues = {
    product_name: '',
    price: '',
    imageURL: '',
    description: '',
    category: '',
    farm: '',
    inStock: ''
}

export default function Create() {
    const navigate = useNavigate();

    const [values, setValues] = useState(initialValues)

    const changeHadler = (e) => {
        const { name, value } = e.target;
        setValues(state => ({
            ...state,
            [name]: value
        }))
    }

    const blockInvalidKeys = (e) => {
        if (['-', '+', 'e', 'E'].includes(e.key)) {
            e.preventDefault();
        }
    };

    const createAction = async () => {
        if(!values.product_name || !values.price || !values.imageURL || !values.description || !values.category || !values.farm || !values.inStock){
            return toast.error('All fields are required!')
        }
        try {
            await create({
                ...values,
                price: Number(values.price),
                inStock: Number(values.inStock)
            })
            toast.success('Product added succesfully!')
            navigate('/catalog')
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="card create">
            <h2 className="text-center">Add New Vegetable</h2>
            <form action={createAction}>
                <div className="form-group">
                    <label htmlFor="name">Vegetable Name</label>
                    <input type="text" id="name" name="product_name" value={values.product_name} onChange={changeHadler} placeholder="e.g., Bell Peppers" />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price per unit (€)</label>
                    <input type="number" step="0.01" min="0" name="price" id="price" value={values.price} onChange={changeHadler} onKeyDown={blockInvalidKeys} placeholder="e.g., 2.50" />
                </div>
                <div className="form-group">
                    <label htmlFor="imageURL">Image URL</label>
                    <input type="url" id="imageURL" name="imageURL" value={values.imageURL} onChange={changeHadler} placeholder="https://example.com/image.jpg" />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" rows="5" value={values.description} onChange={changeHadler} placeholder="Tell your customers about this vegetable..."></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input type="text" id="category" name="category" value={values.category} onChange={changeHadler} placeholder="e.g., Vegetables" />
                </div>
                <div className="form-group">
                    <label htmlFor="farm">Farm</label>
                    <input type="text" id="farm" name="farm" value={values.farm} onChange={changeHadler} placeholder="e.g., Green Acres" />
                </div>
                <div className="form-group">
                    <label htmlFor="inStock">In Stock (kg)</label>
                    <input type="number" id="inStock" name="inStock" value={values.inStock} onChange={changeHadler} onKeyDown={blockInvalidKeys} min="0" step="1" placeholder="e.g., 10" />
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