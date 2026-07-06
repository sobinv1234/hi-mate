import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import { uploadImage } from '../services/imageService/imageService';
import { getImage } from '../config/paths';
import ConfirmModal from '../modals/ConfirmModal';
import MultiLocationSelect from "../modals/MultiLocationSelect";
export default function CreatePost() {

    console.log('process.env.REACT_APP_GOOGLE_MAPS_KEY', process.env.REACT_APP_GOOGLE_MAPS_KEY);
    const [showModal, setShowModal] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [productAmount, setProductAmount] = useState('');
    const [productImage, setProductImage] = useState('');
    const [productCategory, setProductCategory] = useState([]);
    const [productBrand, setProductBrand] = useState('');

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [cardsAccepted, setCardsAccepted] = useState([]);
    const paymentOptions = ["Cash", "Cards", "Interac"];
    const cardOptions = ["Visa", "Mastercard", "Amex"];
    const hideContactInfo = ["Check it to hide Contact Information for this listing"];
    const [locations, setLocations] = useState([]);
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState('');
    const [phone2, setPhone2] = useState('');
    const [fax, setFax] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');

    // payment methods handler
    const handlePaymentChange = (value) => {
        setPaymentMethods(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };
    // cards accepted handler
    const handleCardChange = (value) => {
        setCardsAccepted(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };
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
    const handleCategoryChange = async (selectedOptions) => {
        if (!selectedOptions || selectedOptions.length === 0) {
            setProductCategory([]);
            return;
        }

        const updatedOptions = [...selectedOptions];

        for (const option of selectedOptions) {
            const exists = categoryOptions.some(
                cat => cat.value.toLowerCase() === option.value.toLowerCase()
            );

            if (!exists) {
                try {
                    await axios.post("http://localhost:4000/categories", {
                        name: option.value
                    });

                    setCategoryOptions(prev => [
                        ...prev,
                        {
                            value: option.value,
                            label: option.label,
                        },
                    ]);
                } catch (err) {
                    console.error(err);
                }
            }
        }

        setProductCategory(updatedOptions);
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

        // if (!productImage) {
        //     err.image = "Product image is required";
        // }

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
                productBrand,
                paymentMethods,
                cardsAccepted,
                locations,
                zipCode,
                phone,
                phone2,
                fax,
                email,
                website
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
        productAmount;

    return (
        <form onSubmit={onSubmit}>
            <div className="row">
                <div className="col-12 col-md-8 my-3">
                    <div className='card shadow-md'>
                        <div className="card-header">
                            General information
                        </div>
                        <div className='card-body p-4'>
                            <div className="row">
                                {/* TITLE */}
                                <div className="col-12 col-md-6 mt-2">
                                    <label>Title</label>
                                    <input
                                        className="form-control mb-1"
                                        value={title}
                                        placeholder="Title"
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                    {errors.title && <small className="text-danger">{errors.title}</small>}
                                </div>

                                {/* CATEGORY */}
                                <div className="col-12 col-md-6  mt-2">
                                    <label>Product Category</label>

                                    <CreatableSelect
                                        isMulti
                                        options={categoryOptions}
                                        value={productCategory}
                                        onChange={handleCategoryChange}
                                        isClearable
                                        placeholder="Search or create category..."
                                        closeMenuOnSelect={false}
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
                                        placeholder="Enter amount"
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
                                            placeholder="Upload image"
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
                                        placeholder="Enter description"
                                    />
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 my-3 d-flex">


                    <div className='card shadow-md'>
                        <div className="card-header">
                            Payment & Location
                        </div>
                        <div className='card-body p-4'>

                            <div className="row">
                                {/* TITLE */}
                                <div className="col-12 col-md-6 mt-2">
                                    <label className="form-label">Mode of payments</label>

                                    <ul className="atbdp-checkbox-list vertical">
                                        {paymentOptions.map(opt => (
                                            <li key={opt} className="mb-1">
                                                <label>
                                                    <input
                                                        type="checkbox" className="form-check-input"
                                                        checked={paymentMethods.includes(opt)}
                                                        onChange={() => handlePaymentChange(opt)}
                                                    />
                                                    {opt}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="col-12 col-md-6 mt-2">
                                    <label className="form-label">Cards Accepted</label>

                                    <ul className="atbdp-checkbox-list vertical">
                                        {cardOptions.map(opt => (
                                            <li key={opt} className="mb-1">
                                                <label>
                                                    <input
                                                        type="checkbox" className="form-check-input"
                                                        checked={cardsAccepted.includes(opt)}
                                                        onChange={() => handleCardChange(opt)}
                                                    />
                                                    {opt}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>

                                </div>
                                <div className="col-12 col-md-12 mt-2">
                                    <MultiLocationSelect
                                        value={locations}
                                        onChange={setLocations}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                <div className="col-12 col-md-12 my-3">
                    <div className='card shadow-md'>
                        <div className="card-header">
                            Contact Information
                        </div>
                        <div className='card-body p-4'>

                            <div className="row">
                                <div className="col-12 p-0">
                                    {/* <ul className="atbdp-checkbox-list vertical">
                                        {hideContactInfo.map(opt => (
                                            <li key={opt} className="mb-1">
                                                <label>
                                                    <input
                                                        type="checkbox" className="form-check-input"
                                                        checked={hideContactInfo.includes(opt)}
                                                        // onChange={() => handleHideContactInfoChange(opt)}
                                                    />
                                                    {opt}
                                                </label>
                                            </li>
                                        ))}
                                    </ul> */}
                                </div>

                                <div className="col-12 col-md-2 mt-2">
                                    <label>Post Code:</label>
                                    <input
                                        className="form-control mb-1"
                                        value={zipCode} placeholder="Post Code"
                                        onChange={e => setZipCode(e.target.value)}
                                    />
                                    {errors.zipCode && <small className="text-danger">{errors.zipCode}</small>}
                                </div>
                                <div className="col-12 col-md-2 mt-2">
                                    <label>Phone:</label>
                                    <input
                                        className="form-control mb-1"
                                        value={phone} placeholder="Enter Phone Number"
                                        onChange={e => setPhone(e.target.value)}
                                    />
                                    {errors.phone && <small className="text-danger">{errors.phone}</small>}
                                </div>
                                <div className="col-12 col-md-2 mt-2">
                                    <label>Phone 2:</label>
                                    <input
                                        className="form-control mb-1"
                                        value={phone2} placeholder="Enter Phone Number"
                                        onChange={e => setPhone2(e.target.value)}
                                    />
                                    {errors.phone2 && <small className="text-danger">{errors.phone2}</small>}
                                </div>
                                <div className="col-12 col-md-2 mt-2">
                                    <label>Fax:</label>
                                    <input
                                        className="form-control mb-1"
                                        value={fax} placeholder="Enter Fax Number"
                                        onChange={e => setFax(e.target.value)}
                                    />
                                    {errors.fax && <small className="text-danger">{errors.fax}</small>}
                                </div>
                                <div className="col-12 col-md-2 mt-2">
                                    <label>Email:</label>
                                    <input
                                        className="form-control mb-1" type='email'
                                        value={email} placeholder="Enter Email Address"
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                    {errors.email && <small className="text-danger">{errors.email}</small>}
                                </div>
                                <div className="col-12 col-md-2 mt-2">
                                    <label>Website:</label>
                                    <input
                                        className="form-control mb-1" type='url'
                                        value={website} placeholder="Enter Website URL"
                                        onChange={e => setWebsite(e.target.value)}
                                    />
                                    {errors.website && <small className="text-danger">{errors.website}</small>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4 my-3 offset-md-4">
                    {/* SUBMIT */}
                    <button className="btn btn-primary w-100 mt-3 mt-md-4 py-2" disabled={!isFormValid}>
                        Submit
                    </button>
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

        </form>
    );
}