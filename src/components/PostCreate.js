import React, { useState } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import { uploadImage } from '../services/imageService/imageService';

export default () => {
    const uploadImageHandler = async (e) => {
        const file = e.target.files[0];

        const url = await uploadImage(file); // 👈 service handles AWS/Cloudinary

        setProductImage(url);
    };

    const [productImage, setProductImage] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [productAmount, setProductAmount] = useState('');
    const onSubmit = async (event) => {
        event.preventDefault();
        await axios.post('http://localhost:4000/posts', { title, description, productImage, productAmount });
        setTitle('');
        setDescription('');
        setProductAmount('');
        setProductImage('');
    };

    return <div className="col-12 col-md-8 my-3">
        <div className='card shadow-lg p-4'>
            <div className='card-body'>
                <form className="form-group" onSubmit={onSubmit}>
                    <div className="float-left d-flex flex-column">
                        <div className="col-12">
                            <label className='mb-2'>Product Name <span className="text-danger">*</span></label>
                            <input className="formControl w-100 mb-3 p-2" placeholder='Enter the title of the product' value={title}
                                onChange={e => setTitle(e.target.value)} required />
                        </div>
                        <div className="col-12">
                            <div className="row">
                                <div className="col-6">
                                    <label className='mb-2'>Product Amount <span className="text-danger">*</span></label>
                                    <input className="formControl w-100 mb-3 p-2" placeholder='Amount (£)' value={productAmount}
                                        onChange={e => setProductAmount(e.target.value)} type="number" step="0.01" min="0" required />
                                </div>
                                <div className="col-6 pt-2">
                                    <label htmlFor="productImage" className="form-label mb-2">Upload Product Images</label>
                                    <input className="form-control" type="file"
                                        id="productImage" onChange={uploadImageHandler} />
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <label className='mb-2'>Product Description</label>
                            <textarea className="formControl w-100 mb-3 p-2" rows="2" value={description}
                                onChange={e => setDescription(e.target.value)} placeholder="Product Description" />
                        </div>
                        <button className="btn btn-primary float-left" disabled={!title.trim() || !productAmount.trim()}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>;
}