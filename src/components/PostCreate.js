import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import { uploadImage } from '../services/imageService/imageService';
import { getImage } from '../config/paths';
import ConfirmModal from '../modals/ConfirmModal';

export default function CreatePost() {

    const [showModal, setShowModal] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [productAmount, setProductAmount] = useState('');
    const [productImage, setProductImage] = useState('');
    const [productCategory, setProductCategory] = useState(null);
    const [productBrand, setProductBrand] = useState('');

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [errors, setErrors] = useState({});

    // -------------------------
    // LOAD CATEGORIES
    // -------------------------
    useEffect(() => {
        axios.get("http://localhost:4000/categories")
            .then(res => {
                const formatted = res.data.map(c => ({
                    value: c.name,
                    label: c.name
                }));
                setCategoryOptions(formatted);
            })
            .catch(err => console.error(err));
    }, []);

    // -------------------------
    // IMAGE UPLOAD
    // -------------------------
    const uploadImageHandler = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        try {
            const url = await uploadImage(file);
            setProductImage(url);
        } catch (err) {
            console.error("Image upload failed:", err);
        }
    };

    // -------------------------
    // CATEGORY HANDLER
    // -------------------------
    const handleCategoryChange = async (selected) => {

        if (!selected) {
            setProductCategory(null);
            return;
        }

        const value = selected.value;

        const exists = categoryOptions.some(
            opt => opt.value.toLowerCase() === value.toLowerCase()
        );

        if (!exists) {
            try {
                await axios.post("http://localhost:4000/categories", {
                    name: value
                });

                setCategoryOptions(prev => [
                    ...prev,
                    { value, label: value }
                ]);

            } catch (err) {
                console.error(err);
            }
        }

        setProductCategory(value);
    };

    // -------------------------
    // VALIDATION
    // -------------------------
    const validate = () => {
        let err = {};

        if (!title.trim()) {
            err.title = "Product name is required";
        }

        if (!productCategory) {
            err.category = "Category is required";
        }

        if (!productAmount || Number(productAmount) <= 0) {
            err.amount = "Valid amount is required";
        }

        if (!productImage) {
            err.image = "Product image is required";
        }

        setErrors(err);

        return Object.keys(err).length === 0;
    };

    // -------------------------
    // SUBMIT
    // -------------------------
    const onSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        try {
            await axios.post('http://localhost:4000/posts', {
                title,
                description,
                productImage,
                productAmount,
                productCategory,
                productBrand
            });

            // RESET
            setTitle('');
            setDescription('');
            setProductAmount('');
            setProductImage('');
            setProductCategory(null);
            setProductBrand('');
            setErrors({});

            setShowModal(true);

        } catch (err) {
            console.error(err);
        }
    };
    // validation
    const isFormValid =
        title.trim() &&
        productCategory &&
        productAmount &&
        Number(productAmount) > 0;

    return (
        <div className="col-12 col-md-8 my-3">
            <div className='card shadow-md p-4'>
                <div className='card-body'>

                    <form onSubmit={onSubmit}>
                        <div className="row">
                            {/* TITLE */}
                            <div className="col-12 col-md-6 mt-2">
                                <label>Product Name</label>
                                <input
                                    className="form-control mb-1"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                                {errors.title && <small className="text-danger">{errors.title}</small>}
                            </div>

                            {/* CATEGORY */}
                            <div className="col-12 col-md-6  mt-2">
                                <label>Product Category</label>

                                <CreatableSelect
                                    options={categoryOptions}
                                    value={
                                        productCategory ? { value: productCategory, label: productCategory } : null
                                    }
                                    onChange={handleCategoryChange}
                                    isClearable
                                    placeholder="Search or create category..."
                                />

                                {errors.category && (
                                    <small className="text-danger">{errors.category}</small>
                                )}
                            </div>

                            {/* AMOUNT + IMAGE */}

                            <div className="col-6 mt-2">
                                <label>Amount (£)</label>
                                <input
                                    type="number"
                                    className="form-control mb-1"
                                    value={productAmount}
                                    onChange={e => setProductAmount(e.target.value)}
                                />
                                {errors.amount && (
                                    <small className="text-danger">{errors.amount}</small>
                                )}
                            </div>

                            <div className="col-6 mt-2">
                                <div className="d-flex flex-column float-left w-75">
                                    <label>Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={uploadImageHandler}
                                    />
                                </div>
                                <div className="mt-2 float-right img-fluid product-img-container w-25">
                                    <img className="img-fluid w-100 pl-3"
                                        src={productImage || getImage('default-product.jpg')}
                                        alt="preview"
                                        style={{ width: 70, marginTop: 10 }}
                                    />


                                    {errors.image && (
                                        <small className="text-danger">{errors.image}</small>
                                    )}
                                </div>
                            </div>


                            {/* DESCRIPTION */}
                            <div className="mt-2">
                                <label>Description</label>
                                <textarea
                                    className="form-control"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>

                            {/* SUBMIT */}
                            <button className="btn btn-primary w-100 mt-3 mt-md-4" disabled={!isFormValid}>
                                Submit
                            </button>
                        </div>
                    </form>

                </div>
            </div>

            {/* MODAL */}
            <ConfirmModal
                show={showModal}
                title="Success"
                message="Product submitted successfully!"
                confirmText="OK"
                cancelText="Close"
                onConfirm={() => setShowModal(false)}
                onCancel={() => setShowModal(false)}
            />
        </div>
    );
}