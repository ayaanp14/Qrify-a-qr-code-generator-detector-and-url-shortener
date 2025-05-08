import React, { useState, useEffect } from 'react';
import GmailAuth from './GmailAuth';

const GmailScraper = ({ userId }) => {
    const [emails, setEmails] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStoredEmails = async () => {
        try {
            const response = await fetch(`/api/emails?userId=${userId}`);
            const data = await response.json();
            setEmails(data.emails || []);
        } catch (error) {
            console.error('Error fetching stored emails:', error);
        }
    };

    const handleScrape = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/emails/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
                credentials: 'include'
            });
            const data = await response.json();
            setEmails(data.emails);
            fetchStoredEmails(); // Refresh the list
        } catch (error) {
            setError('Failed to scrape emails');
            console.error('Error scraping emails:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchStoredEmails();
        }
    }, [userId]);

    return (
        <div className="gmail-scraper">
            <h2>Gmail Scraper</h2>
            {error && <div className="error-message">{error}</div>}
            
            {!isAuthenticated ? (
                <GmailAuth 
                    userId={userId}
                    onAuthSuccess={() => setIsAuthenticated(true)} 
                />
            ) : (
                <>
                    <button 
                        onClick={handleScrape} 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Scraping...' : 'Scrape Emails'}
                    </button>
                    
                    <div className="email-list">
                        {emails.length === 0 ? (
                            <p>No emails found. Click "Scrape Emails" to fetch your messages.</p>
                        ) : (
                            emails.map((email, index) => (
                                <div key={index} className="email-item">
                                    <h4>{email.subject}</h4>
                                    <p>From: {email.from}</p>
                                    <p>{email.snippet}</p>
                                    <small>
                                        {new Date(email.createdAt).toLocaleString()}
                                    </small>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default GmailScraper;