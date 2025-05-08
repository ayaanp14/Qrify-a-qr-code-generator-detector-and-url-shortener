const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const db = require('../config/database');
const { Op } = require('sequelize');

// Initialize models
const Email = require('../models/email.model')(db.sequelize, db.Sequelize.DataTypes);

// Google OAuth setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Store tokens in MySQL
router.post('/store-token', async (req, res) => {
  const { userId, accessToken, refreshToken } = req.body;
  
  try {
    await db.query(
      `INSERT INTO user_tokens (user_id, access_token, refresh_token) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
         access_token = VALUES(access_token), 
         refresh_token = VALUES(refresh_token)`,
      [userId, accessToken, refreshToken]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error storing token:', error);
    res.status(500).json({ error: 'Failed to store token' });
  }
});

// Get stored emails from MySQL
router.get('/emails', async (req, res) => {
  const { userId } = req.query;
  
  try {
    const emails = await Email.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    
    res.json({ emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// Scrape and store emails
router.post('/emails/scrape', async (req, res) => {
  const { userId } = req.body;
  
  if (!oauth2Client.credentials) {
    return res.status(401).json({ error: 'Not authenticated with Google' });
  }

  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 20
    });

    if (!response.data.messages) {
      return res.json({ emails: [] });
    }

    const emailPromises = response.data.messages.map(async (message) => {
      try {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id
        });

        const headers = msg.data.payload.headers || [];
        const subjectHeader = headers.find(h => h.name === 'Subject');
        const fromHeader = headers.find(h => h.name === 'From');
        
        const emailData = {
          userId,
          emailId: message.id,
          subject: subjectHeader ? subjectHeader.value : 'No Subject',
          from: fromHeader ? fromHeader.value : 'Unknown Sender',
          snippet: msg.data.snippet || ''
        };

        // Upsert email to avoid duplicates
        await Email.upsert(emailData);
        
        return emailData;
      } catch (e) {
        console.error(`Error processing email ${message.id}:`, e);
        return null;
      }
    });

    const emails = (await Promise.all(emailPromises)).filter(Boolean);
    res.json({ emails });
  } catch (error) {
    console.error('Error scraping emails:', error);
    res.status(500).json({ 
      error: 'Failed to scrape emails',
      details: error.message 
    });
  }
});

module.exports = router;