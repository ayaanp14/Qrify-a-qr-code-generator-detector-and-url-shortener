const express = require('express');
const router = express.Router();
const db = require('../models'); // Assuming Sequelize or other ORM

// URL shortening route
router.post('/shorten', async (req, res) => {
    const { longUrl, customAlias } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: 'Please provide a long URL' });
    }

    // Generate a unique short code if no custom alias is provided
    const shortCode = customAlias || generateRandomString(6);

    // Store the mapping in your database (Sequelize model example)
    try {
        const newUrl = await db.ShortenedUrl.create({
            shortCode: shortCode,
            longUrl: longUrl,
        });

        // Return the shortened URL
        const shortUrl = `https://qrgns.link/${shortCode}`;
        res.json({ shortUrl });
    } catch (err) {
        res.status(500).json({ error: 'Failed to shorten URL', message: err.message });
    }
});

// Function to generate random string
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

module.exports = router;

// Redirect short URL to original long URL
router.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;

    try {
        const urlEntry = await db.ShortenedUrl.findOne({ where: { shortCode } });

        if (urlEntry) {
            // Optionally: update click count
            urlEntry.clicks += 1;
            await urlEntry.save();

            // Redirect to the original URL
            return res.redirect(urlEntry.longUrl);
        } else {
            return res.status(404).json({ error: 'Short URL not found' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
});
