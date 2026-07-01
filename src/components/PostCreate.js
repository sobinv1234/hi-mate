import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadImage } from '../services/imageService/imageService';
import ConfirmModal from '../modals/ConfirmModal';

export default function CreatePost() {

    const [showModal, setShowModal] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [productAmount, setProductAmount] = useState('');
    const [productImage, setProductImage] = useState('');

    // IMAGE UPLOAD
    const uploadImageHandler = async (e) => {
        const file = e.target.files[0];
        const url = await uploadImage(file);
        setProductImage(url);
    };

    // SUBMIT FORM
    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.post('http://localhost:4000/posts', {
                title,
                description,
                productImage,
                productAmount
            });

            // RESET FORM
            setTitle('');
            setDescription('');
            setProductAmount('');
            setProductImage('');

            // SHOW SUCCESS MODAL
            setShowModal(true);

        } catch (err) {
            console.error("Submit error:", err);
        }
    };

    return (
        <div className="col-12 col-md-8 my-3">
            <div className='card shadow-md p-4'>
                <div className='card-body'>

                    <form onSubmit={onSubmit}>

                        <div className="col-12 px-0">
                            <label className='mb-2'>Product Name</label>
                            <input
                                className="formControl w-100 mb-3 p-2"
                                placeholder='Enter product name'
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-12 px-0">
                            <div className="row">
                                <div className="col-6">
                                    <label className='mb-2'>Product Amount (£)</label>
                                    <input
                                        className="formControl w-100 mb-3 p-2"
                                        placeholder="Amount (£)"
                                        value={productAmount}
                                        onChange={e => setProductAmount(e.target.value)}
                                        onBlur={() => {
                                            if (!productAmount) return;
                                            setProductAmount(Number(productAmount).toFixed(2));
                                        }}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="col-6">
                                    <label className="mb-2">Upload Product Image</label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        accept="image/*"
                                        onChange={uploadImageHandler}
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="col-12 px-0">
                            <label className='mb-2'>Description</label>
                            <textarea
                                className="formControl w-100 mb-3 p-2"
                                rows="2"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="col-12 px-0">
                            <button
                                className="btn btn-primary w-100"
                                type="submit"
                                disabled={!title.trim() || !productAmount.trim()}
                            >
                                Submit
                            </button>
                        </div>

                    </form>

                </div>
            </div>

            {/* ✅ SUCCESS MODAL */}
            <ConfirmModal
                show={showModal}
                title="Success  "
                message="Product submitted successfully!"
                confirmText="OK"
                cancelText="Close"
                onConfirm={() => setShowModal(false)}
                onCancel={() => setShowModal(false)}
            />

        </div>
    );
}