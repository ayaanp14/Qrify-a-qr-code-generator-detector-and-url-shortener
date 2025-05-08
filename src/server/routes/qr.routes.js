const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const db = require("../models");
const QR = db.qr;

// Generate QR code
router.post('/generate', async (req, res) => {
  try {
    const { text, size, color, bgColor } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text or URL is required' });
    }
    
    const options = {
      width: size || 200,
      color: {
        dark: color || '#000000',
        light: bgColor || '#ffffff'
      },
      margin: 2
    };
    
    QRCode.toDataURL(text, options, async (err, dataUrl) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error generating QR code' });
      }
      
      // Save to database
      const qr = await QR.create({
        text,
        size: options.width,
        color: options.color.dark,
        bgColor: options.color.light,
        image: dataUrl
      });
      
      res.json({
        success: true,
        image: dataUrl,
        qrId: qr.id
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get QR code history
router.get('/history', async (req, res) => {
  try {
    const qrCodes = await QR.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    res.json(qrCodes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
// server.js or routes/url.js
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  try {
      const [rows] = await pool.query('SELECT longUrl FROM urls WHERE shortCode = ?', [shortCode]);
      
      if (rows.length > 0) {
          const originalUrl = rows[0].longUrl;
          return res.redirect(originalUrl);
      } else {
          return res.status(404).send('URL not found');
      }
  } catch (err) {
      console.error('Redirect error:', err);
      return res.status(500).send('Server error');
  }
});
