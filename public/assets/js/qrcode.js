
        document.getElementById('generateQR').addEventListener('click', function() {
            const text = document.getElementById('qrText').value.trim();
            const size = document.getElementById('qrSize').value;
            const color = document.getElementById('qrColor').value;
            const bgColor = document.getElementById('qrBgColor').value;

            // Basic Validation
            if (!text) {
                alert('Please enter text or URL to generate QR code');
                return;
            }

            const qrCodeElement = document.getElementById('qrCode');
            qrCodeElement.innerHTML = ''; // Clear previous QR code
            document.getElementById('loader').style.display = 'block'; // Show loader

            QRCode.toCanvas(qrCodeElement, text, {
                width: size,
                color: {
                    dark: color,
                    light: bgColor
                },
                margin: 2
            }, function(error) {
                document.getElementById('loader').style.display = 'none'; // Hide loader

                if (error) {
                    console.error(error);
                    alert('Error generating QR code');
                } else {
                    // Add animation to the generated QR code
                    qrCodeElement.classList.add('animate__animated', 'animate__zoomIn');
                    setTimeout(() => {
                        qrCodeElement.classList.remove('animate__animated', 'animate__zoomIn');
                    }, 1000);

                    // Show download button
                    document.getElementById('downloadQR').style.display = 'inline-block';
                }
            });
        });

        // Download QR Code
       // Download QR Code
document.getElementById('downloadQR').addEventListener('click', function () {
    // Try to find any canvas inside qrCode container
    const qrCodeContainer = document.getElementById('qrCode');
    const canvas = qrCodeContainer.querySelector('canvas') || qrCodeContainer;

    if (!(canvas instanceof HTMLCanvasElement)) {
        alert('No QR code to download');
        return;
    }

    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    // Add animation to the download button
    this.classList.add('animate__animated', 'animate__rubberBand');
    setTimeout(() => {
        this.classList.remove('animate__animated', 'animate__rubberBand');
    }, 1000);
});
// 📤 Image Upload Scanner
const video = document.getElementById('scannerVideo');
const canvas = document.getElementById('qrCanvas');
const ctx = canvas.getContext('2d');
const resultDisplay = document.getElementById('scanResult');
let scanning = false;

// ✅ Start webcam and scan
function startWebcamScanner() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function (stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // iOS compatibility
            video.play();
            scanning = true;
            scanWebcam();
        })
        .catch(function (err) {
            console.error("Camera access denied:", err);
            alert("Camera access was denied or not available.");
        });
}

// ✅ Scan from webcam feed
function scanWebcam() {
    if (!scanning) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
            scanning = false;
            resultDisplay.textContent = code.data;
        } else {
            requestAnimationFrame(scanWebcam);
        }
    } else {
        requestAnimationFrame(scanWebcam);
    }
}

// ✅ Handle uploaded image for QR scan
document.getElementById('qrUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
        const img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code) {
                resultDisplay.textContent = code.data;
            } else {
                resultDisplay.textContent = "No QR code detected in image";
            }
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
});

// ✅ Start webcam on page load
window.addEventListener('load', startWebcamScanner);
