// URL Shortener
document.getElementById('shortenBtn').addEventListener('click', function() {
    const longUrl = document.getElementById('longUrl').value.trim();
    const customAlias = document.getElementById('customAlias').value.trim();
    
    if (!longUrl) {
        alert('Please enter a URL to shorten');
        return;
    }
    
    // In a real app, this would be an API call to your backend
    // For demo purposes, we'll simulate it
    
    // Show loading state
    const btn = this;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Shortening...';
    
    // Simulate API delay
    setTimeout(() => {
        // Generate a random short code
        const shortCode = customAlias || generateRandomString(6);
        const shortUrl = `https://qrgns.link/${shortCode}`;
        
        // Display result
        const resultDiv = document.getElementById('urlResult');
        resultDiv.innerHTML = `
            <p>Short URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a>
            <button class="copy-btn" onclick="copyToClipboard('${shortUrl}')"><i class="fas fa-copy"></i> Copy</button></p>
            <p>Original URL: <span>${longUrl}</span></p>
        `;
        resultDiv.style.display = 'block';
        
        // Add animation
        resultDiv.classList.add('animate__animated', 'animate__fadeInUp');
        setTimeout(() => {
            resultDiv.classList.remove('animate__animated', 'animate__fadeInUp');
        }, 1000);
        
        // Reset button
        btn.disabled = false;
        btn.innerHTML = 'Shorten URL';
    }, 1500);
});

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show copied feedback
        const copyBtns = document.querySelectorAll('.copy-btn');
        copyBtns.forEach(btn => {
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            }, 2000);
        });
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
