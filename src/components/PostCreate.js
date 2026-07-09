import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import { uploadImage } from '../services/imageService/imageService';
import { getImage } from '../config/paths';
import ConfirmModal from '../modals/ConfirmModal';
import MultiLocationSelect from "../modals/MultiLocationSelect";
import TimezoneSelect from "react-timezone-select";
import "leaflet/dist/leaflet.css";
import { useDropzone } from "react-dropzone";

import {
    MapContainer,
    TileLayer,
    Marker,
    useMap
} from "react-leaflet";

import L from "leaflet";
// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

    iconRetinaUrl:
        "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet/dist/images/marker-shadow.png"

});


// Move map automatically when location changes
function ChangeMapView({ position }) {

    const map = useMap();

    map.setView(position, 15);

    return null;
}

const socialOptions = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitter", label: "Twitter / X" },
    { value: "youtube", label: "YouTube" },
    { value: "github", label: "GitHub" },
    { value: "behance", label: "Behance" },
    { value: "dribbble", label: "Dribbble" },
    { value: "pinterest", label: "Pinterest" },
    { value: "reddit", label: "Reddit" },
    { value: "snapchat", label: "Snapchat" },
    { value: "tiktok", label: "TikTok" },
    { value: "telegram", label: "Telegram" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "discord", label: "Discord" },
    { value: "threads", label: "Threads" },
    { value: "flickr", label: "Flickr" },
    { value: "tumblr", label: "Tumblr" },
    { value: "vimeo", label: "Vimeo" },
    { value: "soundcloud", label: "SoundCloud" },
    { value: "medium", label: "Medium" },
    { value: "website", label: "Website" }
];
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
    const [locations, setLocations] = useState([]);
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState('');
    const [phone2, setPhone2] = useState('');
    const [fax, setFax] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [socialLinks, setSocialLinks] = useState([]);
    const [showDeleteSocialModal, setShowDeleteSocialModal] = useState(false);
    const [socialIndexToDelete, setSocialIndexToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState("");
    const [hideContactInfo, setHideContactInfo] = useState([]);
    const [hideOpeningHoursInfo, setHideOpeningHoursInfo] = useState([]);
    const [isOpen247, setIsOpen247] = useState(false);
    const hideContactOptionsContactInfo = [
        {
            label: "Check it to hide Contact Information for this listing",
            value: "hideContact"
        }
    ];
    const hideContactOptionsOpeningHoursInfo = [
        {
            label: "Hide business hours",
            value: "hideHoursInfo"
        }
    ];
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
                website,
                socialLinks,
                isOpen247,
                openingHours,
                timezone,
                mapAddress,
                latitude,
                longitude,
                faqs,
                sliderImages,
                videoUrl,
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
    // social media link
    const addSocialField = () => {
        setSocialLinks([
            ...socialLinks,
            {
                platform: "facebook",
                url: ""
            }
        ]);
    };
    const removeSocialField = (index) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
    };
    const handleSocialChange = (index, field, value) => {
        const updated = [...socialLinks];
        updated[index][field] = value;
        setSocialLinks(updated);
    };
    const handleHideContactInfoChangeContactInfo = (option) => {
        setHideContactInfo(prev =>
            prev.includes(option)
                ? prev.filter(item => item !== option)
                : [...prev, option]
        );
    };
    const handleHideContactInfoChangeOpeningHours = (option) => {
        setHideOpeningHoursInfo(prev =>
            prev.includes(option)
                ? prev.filter(item => item !== option)
                : [...prev, option]
        );
    };
    // opening and clossing business
    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    const [selectedDay, setSelectedDay] = useState("Monday");

    const [openingHours, setOpeningHours] = useState({
        Monday: { type: "times", from: "09:00", to: "17:00" },
        Tuesday: { type: "times", from: "09:00", to: "17:00" },
        Wednesday: { type: "times", from: "09:00", to: "17:00" },
        Thursday: { type: "times", from: "09:00", to: "17:00" },
        Friday: { type: "times", from: "09:00", to: "17:00" },
        Saturday: { type: "closed", from: "", to: "" },
        Sunday: { type: "closed", from: "", to: "" }
    });
    const handleOpeningChange = (field, value) => {
        setOpeningHours(prev => ({
            ...prev,
            [selectedDay]: {
                ...prev[selectedDay],
                [field]: value
            }
        }));
    };
    // time zoon

    const [timezone, setTimezone] = useState(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    // map
    // -------------------------
    // MAP LOCATION
    // -------------------------
    const [mapAddress, setMapAddress] = useState("");
    const [mapPosition, setMapPosition] = useState({
        lat: 51.5074,
        lng: -0.1278
    });
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [manualCoordinates, setManualCoordinates] = useState(false);
    // -------------------------
    // SEARCH ADDRESS USING OPENSTREETMAP
    // -------------------------
    const searchAddress = async () => {
        if (!mapAddress.trim()) return;
        try {
            const response = await fetch(

                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapAddress)}`

            );
            const data = await response.json();
            if (data.length > 0) {
                const location = {
                    lat: Number(data[0].lat),
                    lng: Number(data[0].lon)
                };
                setMapPosition(location);
                setLatitude(location.lat);
                setLongitude(location.lng);
            } else {
                alert("Address not found");
            }
        } catch (error) {
            console.log("Map search error:", error);
        }
    };
    const updateManualCoordinates = (lat, lng) => {
        if (!lat || !lng) return;
        const location = {
            lat: Number(lat),
            lng: Number(lng)
        };
        if (!isNaN(location.lat) && !isNaN(location.lng)) {
            setMapPosition(location);
        }
    };
    // faq 
    const [faqs, setFaqs] = useState([]);
    const [faqIndexToDelete, setFaqIndexToDelete] = useState(null);
    // ADD FAQ

    const addFaq = () => {
        if (faqs.length > 0) {
            const lastFaq = faqs[faqs.length - 1];

            if (
                !lastFaq.question.trim() ||
                !lastFaq.answer.trim()
            ) {
                alert("Please complete the current FAQ before adding a new one.");
                return;
            }
        }

        setFaqs([
            ...faqs,
            {
                question: "",
                answer: ""
            }
        ]);
    };
    // UPDATE FAQ
    const handleFaqChange = (index, field, value) => {
        const updatedFaqs = [...faqs];
        updatedFaqs[index][field] = value;
        setFaqs(updatedFaqs);
    };
    // REMOVE FAQ
    const removeFaq = (index) => {
        setFaqs(
            faqs.filter((_, i) => i !== index)
        );
    };
    const moveFaqUp = (index) => {
        if (index === 0) return;

        const updated = [...faqs];

        [updated[index - 1], updated[index]] =
            [updated[index], updated[index - 1]];

        setFaqs(updated);
    };

    const moveFaqDown = (index) => {
        if (index === faqs.length - 1) return;

        const updated = [...faqs];

        [updated[index + 1], updated[index]] =
            [updated[index], updated[index + 1]];

        setFaqs(updated);
    };
    // images and video upload
    const [sliderImages, setSliderImages] = useState([]);
    const [videoUrl, setVideoUrl] = useState("");
    const removeSliderImage = (index) => {
        setSliderImages(sliderImages.filter((_, i) => i !== index));
    };
    const onDrop = async (acceptedFiles) => {
        const uploadedImages = [];

        for (const file of acceptedFiles) {
            const url = await uploadImage(file);

            uploadedImages.push({
                url,
                name: file.name
            });
        }

        setSliderImages(prev => [...prev, ...uploadedImages]);
    };
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": []
        },
        maxFiles: 2
    });
    // prioritising images
    const moveSliderImageUp = (index) => {
        if (index === 0) return;

        const updated = [...sliderImages];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        setSliderImages(updated);
    };

    const moveSliderImageDown = (index) => {
        if (index === sliderImages.length - 1) return;

        const updated = [...sliderImages];
        [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
        setSliderImages(updated);
    };
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

                            <div>
                                <div className="col-12 p-0">
                                    <ul className="atbdp-checkbox-list vertical">
                                        {hideContactOptionsContactInfo.map(opt => (
                                            <li key={opt.value}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={hideContactInfo.includes(opt.value)}
                                                        onChange={() => handleHideContactInfoChangeContactInfo(opt.value)}
                                                    />
                                                    {opt.label}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {!hideContactInfo.includes("hideContact") && (
                                    <div className="row">
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
                                                value={phone} type='number' placeholder="Enter Phone Number"
                                                onChange={e => setPhone(e.target.value)}
                                            />
                                            {errors.phone && <small className="text-danger">{errors.phone}</small>}
                                        </div>
                                        <div className="col-12 col-md-2 mt-2">
                                            <label>Phone 2:</label>
                                            <input
                                                className="form-control mb-1"
                                                value={phone2} type='number' placeholder="Enter Phone Number"
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

                                        <div className="col-12 col-md-12 mt-3">

                                            <label className="fw-bold col-12 p-0 mb-0">
                                                Social Information
                                            </label>

                                            {/* Social Fields */}
                                            {socialLinks.map((item, index) => (
                                                <div className="row mt-2 align-items-center" key={index}>

                                                    <div className="col-md-3">
                                                        <select
                                                            className="form-control form-select"
                                                            value={item.platform}
                                                            onChange={(e) =>
                                                                handleSocialChange(index, "platform", e.target.value)
                                                            }
                                                        >
                                                            {socialOptions.map(option => (
                                                                <option
                                                                    key={option.value}
                                                                    value={option.value}
                                                                >
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="col-md-7">
                                                        <input
                                                            type="url"
                                                            className="form-control"
                                                            placeholder="https://example.com"
                                                            value={item.url}
                                                            onChange={(e) =>
                                                                handleSocialChange(index, "url", e.target.value)
                                                            }
                                                        />
                                                    </div>

                                                    <div className="col-md-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={() => {
                                                                setDeleteType("social");
                                                                setSocialIndexToDelete(index);
                                                                setShowDeleteSocialModal(true);
                                                            }}
                                                        >
                                                            <i class="fa-solid fa-trash-can"></i>
                                                        </button>
                                                    </div>

                                                </div>
                                            ))}

                                            {/* Add Button */}
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm mt-2"
                                                onClick={addSocialField}>
                                                + Add New
                                            </button>

                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-8 my-3">
                    <div className='card shadow-md'>
                        <div className="card-header">
                            Opening/Business Hour Information
                        </div>
                        <div className='card-body p-4'>
                            <div>
                                <div className="col-12 px-3 px-md-3">
                                    <div className="atbdp-checkbox-list vertical">
                                        {hideContactOptionsOpeningHoursInfo.map(opt => (
                                            <li key={opt.value}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={hideOpeningHoursInfo.includes(opt.value)}
                                                        onChange={() => handleHideContactInfoChangeOpeningHours(opt.value)}
                                                    />
                                                    {opt.label}
                                                </label>
                                            </li>
                                        ))}
                                    </div>
                                </div>

                                {!hideOpeningHoursInfo.includes("hideHoursInfo") && (
                                    <div className="col-12 p-0">
                                        <div className='px-3 px-md-3'>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input me-2"
                                                    checked={isOpen247}
                                                    onChange={(e) => setIsOpen247(e.target.checked)}
                                                />
                                                Is this listing open 24 hours 7 days a week?
                                            </label>

                                            <div className="mt-2">
                                                {!isOpen247 && (
                                                    <div className="row">



                                                        <div className='p-0'>
                                                            <div className="col-12 p-0">
                                                                <div className="mb-3">

                                                                    {days.map(day => (

                                                                        <button
                                                                            key={day}
                                                                            type="button"
                                                                            className={`btn me-2 mb-2 ${selectedDay === day
                                                                                ? "btn-primary"
                                                                                : "btn-outline-primary"
                                                                                }`}
                                                                            onClick={() => setSelectedDay(day)}
                                                                        >
                                                                            {day}
                                                                        </button>

                                                                    ))}

                                                                </div>
                                                            </div>
                                                            <div className='col-12 p-0'>
                                                                <div className="row my-3">

                                                                    <h5>{selectedDay}</h5>

                                                                    <div className="col-md-3 col-6 my-2">
                                                                        <div className='col-12 p-0'>
                                                                            <div className="form-check">

                                                                                <input
                                                                                    id={`${selectedDay}-times`}
                                                                                    name={`opening-${selectedDay}`}
                                                                                    type="radio"
                                                                                    className="form-check-input"
                                                                                    checked={openingHours[selectedDay].type === "times"}
                                                                                    onChange={() => handleOpeningChange("type", "times")}
                                                                                />

                                                                                <label
                                                                                    className="form-check-label"
                                                                                    htmlFor={`${selectedDay}-times`}
                                                                                >
                                                                                    Enter Times
                                                                                </label>

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-md-3 col-6 my-2">
                                                                        <div className='col-12 p-0'>
                                                                            <div className="form-check">

                                                                                <input
                                                                                    id={`${selectedDay}-open`}
                                                                                    name={`opening-${selectedDay}`}
                                                                                    type="radio"
                                                                                    className="form-check-input"
                                                                                    checked={openingHours[selectedDay].type === "open"}
                                                                                    onChange={() => handleOpeningChange("type", "open")}
                                                                                />

                                                                                <label
                                                                                    className="form-check-label"
                                                                                    htmlFor={`${selectedDay}-open`}
                                                                                >
                                                                                    Open All Day
                                                                                </label>

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-md-3 col-6 my-2">
                                                                        <div className='col-12 p-0'>
                                                                            <div className="form-check">

                                                                                <input
                                                                                    id={`${selectedDay}-closed`}
                                                                                    name={`opening-${selectedDay}`}
                                                                                    type="radio"
                                                                                    className="form-check-input"
                                                                                    checked={openingHours[selectedDay].type === "closed"}
                                                                                    onChange={() => handleOpeningChange("type", "closed")}
                                                                                />

                                                                                <label
                                                                                    className="form-check-label"
                                                                                    htmlFor={`${selectedDay}-closed`}
                                                                                >
                                                                                    Closed All Day
                                                                                </label>

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className='col-md-9 p-0'>
                                                                    {openingHours[selectedDay].type === "times" && (

                                                                        <div className="row">

                                                                            <div className="col-md-6 col-6">
                                                                                <label>Time From</label>

                                                                                <input
                                                                                    type="time"
                                                                                    className="form-control"
                                                                                    value={openingHours[selectedDay].from}
                                                                                    onChange={(e) =>
                                                                                        handleOpeningChange("from", e.target.value)
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className="col-md-6 col-6">
                                                                                <label>Time To</label>

                                                                                <input
                                                                                    type="time"
                                                                                    className="form-control"
                                                                                    value={openingHours[selectedDay].to}
                                                                                    onChange={(e) =>
                                                                                        handleOpeningChange("to", e.target.value)
                                                                                    }
                                                                                />
                                                                            </div>

                                                                        </div>

                                                                    )}



                                                                </div>
                                                            </div>

                                                            <div className='col-9 p-0 my-3 '>

                                                                <TimezoneSelect
                                                                    value={timezone}
                                                                    onChange={setTimezone}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4 my-3">

                    <div className='card shadow-md'>

                        <div className="card-header">
                            Map
                        </div>


                        <div className='card-body p-4'>


                            {/* Address Search */}
                            <div className='col-12 p-0'>
                                <label className="form-label">
                                    Search Address
                                </label>


                                <div className='col-12 d-flex -justify-content-center align-items-center p-0'>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter business address"
                                        value={mapAddress}
                                        disabled={manualCoordinates}
                                        onChange={(e) => setMapAddress(e.target.value)}
                                    />


                                    <button
                                        type="button"
                                        className="btn btn-primary ms-2 m-0"
                                        disabled={manualCoordinates}
                                        onClick={searchAddress}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>


                            <hr />



                            {/* Manual Coordinates Checkbox */}

                            <div className="form-check mb-3">

                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="manualCoordinates"
                                    checked={manualCoordinates}
                                    onChange={(e) => {

                                        setManualCoordinates(e.target.checked);

                                    }}
                                />


                                <label
                                    className="form-check-label"
                                    htmlFor="manualCoordinates"
                                >

                                    Or Enter Coordinates
                                    (latitude and longitude) Manually

                                </label>


                            </div>
                            {/* Latitude Longitude Fields */}
                            {manualCoordinates && (
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label>
                                            Latitude
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Latitude"
                                            value={latitude}
                                            onChange={(e) => {
                                                setLatitude(e.target.value);
                                                updateManualCoordinates(
                                                    e.target.value,
                                                    longitude
                                                );
                                            }}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label>
                                            Longitude
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Longitude"
                                            value={longitude}
                                            onChange={(e) => {
                                                setLongitude(e.target.value);
                                                updateManualCoordinates(
                                                    latitude,
                                                    e.target.value
                                                );
                                            }}
                                        />

                                    </div>
                                </div>
                            )}
                            {/* MAP */}
                            <MapContainer center={mapPosition}
                                zoom={13} style={{ width: "100%", height: "194px", borderRadius: "8px" }} >
                                <ChangeMapView
                                    position={mapPosition}
                                />
                                <TileLayer
                                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; OpenStreetMap contributors'
                                />
                                <Marker
                                    position={mapPosition}
                                />
                            </MapContainer>
                            {/* Hidden values for submit */}
                            <input
                                type="hidden"
                                value={latitude}
                                name="latitude"
                            />
                            <input
                                type="hidden"
                                value={longitude}
                                name="longitude"
                            />
                        </div>
                    </div>

                </div>


                <div className="col-12 col-md-12 my-3">

                    <div className="card shadow-md">


                        <div className="card-header">
                            Listings FAQs
                        </div>


                        <div className="card-body p-4">


                            {
                                faqs.map((faq, index) => (

                                    <div
                                        className="border rounded p-3 mb-3"
                                        key={index}
                                    >


                                        <div className="row">


                                            <div className="col-lg-11 col-md-10 col-8">


                                                <label>
                                                    Question
                                                </label>


                                                <input

                                                    type="text"

                                                    className="form-control mb-3"

                                                    placeholder="Enter FAQ question"

                                                    value={faq.question}

                                                    onChange={(e) =>

                                                        handleFaqChange(
                                                            index,
                                                            "question",
                                                            e.target.value
                                                        )

                                                    }

                                                />



                                                <label>
                                                    Answer
                                                </label>


                                                <textarea

                                                    className="form-control"

                                                    rows="3"

                                                    placeholder="Enter FAQ answer"

                                                    value={faq.answer}

                                                    onChange={(e) =>

                                                        handleFaqChange(
                                                            index,
                                                            "answer",
                                                            e.target.value
                                                        )

                                                    }

                                                />


                                            </div>



                                            <div className="col-lg-1 col-md-2 col-4 d-flex align-items-start flex-column">
                                                <div className='d-flex justify-content-center align-item-center mb-auto'>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary me-2 p-1"
                                                        disabled={index === 0}
                                                        onClick={() => moveFaqUp(index)}
                                                        title="Move Up"
                                                    >
                                                        <i className="fa-solid fa-arrow-up"></i>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary p-1"
                                                        disabled={index === faqs.length - 1}
                                                        onClick={() => moveFaqDown(index)}
                                                        title="Move Down"
                                                    >
                                                        <i className="fa-solid fa-arrow-down"></i>
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => {
                                                        setDeleteType("faq");
                                                        setFaqIndexToDelete(index);
                                                        setShowDeleteSocialModal(true);
                                                    }}
                                                    title="Delete FAQ"
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>



                                            </div>
                                        </div>
                                    </div>
                                ))
                            }




                            <button

                                type="button"

                                className="btn btn-primary btn-sm"

                                onClick={addFaq}

                            >

                                + Add New FAQ

                            </button>


                        </div>


                    </div>

                    <div className="col-12 my-3 p-0">
                        <div className="card shadow-md">
                            <div className="card-header">
                                Images & Video
                            </div>

                            <div className="card-body p-4">
                                <div className='row'>
                                    <div className='col-md-6 d-flex align-items-center justify-content-center'>
                                        {/* Drag & Drop Upload */}
                                        <div
                                            {...getRootProps()}
                                            className="border border-2 border-dashed rounded p-3 p-md-5 text-center w-100"
                                            style={{
                                                cursor: "pointer",
                                                background: "#fafafa"
                                            }}
                                        >
                                            <input {...getInputProps()} />

                                            <i
                                                className="fa-solid fa-cloud-arrow-up mb-3"
                                                style={{ fontSize: 45 }}
                                            ></i>

                                            <h5>Drag & Drop</h5>

                                            <p className="mb-2">
                                                or
                                            </p>

                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                            >
                                                Upload
                                            </button>

                                            <small className="d-block mt-3 text-muted">
                                                Maximum total allowed file size is 2.00 MB
                                            </small>

                                            <small className="d-block text-muted">
                                                Maximum 2 files are allowed
                                            </small>
                                        </div>
                                    </div>

                                    <div className='col-md-6 image-prev'>

                                        {/* Preview */}

                                        {sliderImages.length > 0 && (

                                            <div className="row mt-4">

                                                {sliderImages.map((img, index) => (

                                                    <div
                                                        className="col-md-4 mb-3"
                                                        key={index}
                                                    >
                                                        <div className="card">
                                                            <div
                                                                className="position-absolute top-0 start-0 bg-dark text-white px-2 py-1"
                                                                style={{ borderBottomRightRadius: "6px" }}
                                                            >
                                                                #{index + 1}
                                                            </div>
                                                            <img
                                                                src={img.url}
                                                                alt=""
                                                                className="card-img-top"
                                                                style={{
                                                                    height: 150,
                                                                    objectFit: "cover"
                                                                }}
                                                            />

                                                            <div className="card-body text-center">

                                                                <div className="btn-group">

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-secondary"
                                                                        disabled={index === 0}
                                                                        onClick={() => moveSliderImageUp(index)}
                                                                        title="Increase Priority"
                                                                    >
                                                                        <i className="fa-solid fa-arrow-up"></i>
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-secondary"
                                                                        disabled={index === sliderImages.length - 1}
                                                                        onClick={() => moveSliderImageDown(index)}
                                                                        title="Decrease Priority"
                                                                    >
                                                                        <i className="fa-solid fa-arrow-down"></i>
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger"
                                                                        onClick={() => removeSliderImage(index)}
                                                                        title="Delete"
                                                                    >
                                                                        <i className="fa-solid fa-trash"></i>
                                                                    </button>

                                                                </div>

                                                            </div>

                                                        </div>
                                                    </div>

                                                ))}

                                            </div>

                                        )}
                                    </div>

                                    {/* Video */}

                                    <div className="col-6 mt-4">

                                        <label className="form-label">
                                            Video URL
                                        </label>

                                        <input
                                            type="url"
                                            className="form-control"
                                            placeholder="https://youtube.com/..."
                                            value={videoUrl}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                        />

                                    </div>

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





            </div>
            {/* success MODAL */}
            <ConfirmModal
                show={showModal}
                title="Success"
                message="Product submitted successfully!"
                confirmText="OK"
                cancelText="Close"
                onConfirm={() => setShowModal(false)}
                onCancel={() => setShowModal(false)}
            />
            {/* delete MODAL*/}
            <ConfirmModal
                show={showDeleteSocialModal}
                title={deleteType === "faq" ? "Delete FAQ" : "Delete Social Link"}

                message={
                    deleteType === "faq"
                        ? "Are you sure you want to remove this FAQ?"
                        : "Are you sure you want to remove this social link?"
                }
                confirmText="Yes"
                cancelText="No"
                onConfirm={() => {

                    if (deleteType === "social") {
                        removeSocialField(socialIndexToDelete);
                        setSocialIndexToDelete(null);
                    }

                    if (deleteType === "faq") {
                        removeFaq(faqIndexToDelete);
                        setFaqIndexToDelete(null);
                    }

                    setDeleteType("");
                    setShowDeleteSocialModal(false);
                }}
                onCancel={() => {

                    setDeleteType("");

                    setSocialIndexToDelete(null);

                    setFaqIndexToDelete(null);

                    setShowDeleteSocialModal(false);

                }}
            />
        </form>
    );
}