import React from 'react';

const GmailAuth = ({ onAuthSuccess }) => {
    const handleAuth = () => {
        // This would typically open Google OAuth window
        window.open('/api/auth/google', '_blank');
        
        // For demo purposes, we'll just call success
        setTimeout(() => {
            onAuthSuccess();
        }, 2000);
    };

    return (
        <div className="gmail-auth">
            <button onClick={handleAuth}>Authenticate with Gmail</button>
        </div>
    );
};

export default GmailAuth;