document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            tabContents[index].classList.add('active');
            
            // If switching to scanner tab, start the camera
            if (index === 1) {
                startScanner();
            } else {
                stopScanner();
            }
        });
    });
    
    // Set first tab as active by default
    if (tabBtns.length > 0) {
        tabBtns[0].classList.add('active');
        tabContents[0].classList.add('active');
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.card, .form-group, .btn');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
});

// Start/stop scanner when tab changes
let scannerInterval;

function startScanner() {
    const video = document.getElementById('scanner');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
            
            scannerInterval = setInterval(() => {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    
                    if (code) {
                        document.getElementById('scanResult').textContent = code.data;
                        // Add pulse animation when QR is detected
                        document.querySelector('.scan-result').classList.add('animate__animated', 'animate__pulse');
                        setTimeout(() => {
                            document.querySelector('.scan-result').classList.remove('animate__animated', 'animate__pulse');
                        }, 1000);
                    }
                }
            }, 100);
        })
        .catch(function(err) {
            console.error('Error accessing camera:', err);
            document.getElementById('scanResult').textContent = 'Could not access camera. Please ensure you have granted camera permissions.';
        });
}

function stopScanner() {
    const video = document.getElementById('scanner');
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
    if (scannerInterval) {
        clearInterval(scannerInterval);
    }
}