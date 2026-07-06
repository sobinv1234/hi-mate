const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// ----------------------
// IN-MEMORY DB
// ----------------------
const posts = {};
const categories = {};

// ----------------------
// POSTS APIs
// ----------------------

// GET all posts
app.get('/posts', (req, res) => {
    res.send(Object.values(posts));
});

// CREATE post
app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex');

    const {
        title,
        description,
        productAmount,
        productImage,
        productCategory,
        productBrand,
        productColor,
        productSize,
        productMaterial,
        productWeight,
        productDimensions,
        productStock,
        productRating,
        productReviews,
        productDiscount,
        productShipping,
        productReturnPolicy,
        productWarranty,
        productSeller,
        productManufacturer,
        productReleaseDate,
        productExpirationDate,
        productIngredients,
        productAllergens,
        productUsageInstructions,
        productSafetyWarnings,
        productCertifications,
        productFeatures,
        productCompatibility,
        productAccessories,
        productBundle,
        productCustomizations,
        productPersonalizations,
        paymentMethods,
        cardsAccepted,
        locations,
        zipCode,
        phone,
        phone2,
        fax,
        email,
        website,
        socialMedia,
    } = req.body;

    posts[id] = {
        id,
        title,
        description,
        productAmount,
        productImage,
        productCategory,
        productBrand,
        productColor,
        productSize,
        productMaterial,
        productWeight,
        productDimensions,
        productStock,
        productRating,
        productReviews,
        productDiscount,
        productShipping,
        productReturnPolicy,
        productWarranty,
        productSeller,
        productManufacturer,
        productReleaseDate,
        productExpirationDate,
        productIngredients,
        productAllergens,
        productUsageInstructions,
        productSafetyWarnings,
        productCertifications,
        productFeatures,
        productCompatibility,
        productAccessories,
        productBundle,
        productCustomizations,
        productPersonalizations,
        paymentMethods,
        cardsAccepted,
        locations,
        zipCode,
        phone,
        phone2,
        fax,
        email,
        website,
        socialMedia,
    };

    res.status(201).send(posts[id]);
});

// DELETE post
app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;

    if (posts[id]) {
        delete posts[id];
        return res.status(200).send({ message: 'Post deleted successfully' });
    }

    res.status(404).send({ message: 'Post not found' });
});


// ----------------------
// CATEGORIES APIs
// ----------------------

// GET all categories
app.get('/categories', (req, res) => {
    res.send(Object.values(categories));
});

// CREATE category (FIX FOR YOUR ERROR)
app.post('/categories', (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { name } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).send({ message: 'Category name required' });
    }

    // prevent duplicates (case-insensitive)
    const exists = Object.values(categories).find(
        c => c.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
        return res.status(200).send(exists);
    }

    const category = {
        id,
        name: name.trim()
    };

    categories[id] = category;

    res.status(201).send(category);
});

// DELETE category
app.delete('/categories/:id', (req, res) => {
    const { id } = req.params;

    if (categories[id]) {
        delete categories[id];
        return res.status(200).send({ message: 'Category deleted successfully' });
    }

    res.status(404).send({ message: 'Category not found' });
});


// ----------------------
// START SERVER
// ----------------------
app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});