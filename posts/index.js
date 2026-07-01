const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// in-memory DB
const posts = {};

// GET all posts (FIXED → return ARRAY)
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
        productPersonalizations
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
        productPersonalizations
    };

    res.status(201).send(posts[id]);
});

app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    if (posts[id]) {
        delete posts[id];
        res.status(200).send({ message: 'Post deleted successfully' });
    } else {
        res.status(404).send({ message: 'Post not found' });
    }
})

app.listen(4000, () => {
    console.log('Posts service running on 4000');
});