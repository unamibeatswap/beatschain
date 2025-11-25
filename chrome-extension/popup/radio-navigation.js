// Radio step navigation
function showRadioStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.radio-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show target step
    const targetStep = document.getElementById(`radio-step-${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }
    
    // Update step indicator
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < stepNumber) {
            step.classList.add('completed');
        } else if (index + 1 === stepNumber) {
            step.classList.add('active');
        }
    });
}

// Initialize radio step navigation when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Step 2 navigation
    document.getElementById('radio-step-2-next')?.addEventListener('click', () => {
        if (validateTrackInfo()) {
            showRadioStep(3);
        }
    });
    
    // Step 3 navigation
    document.getElementById('radio-step-3-back')?.addEventListener('click', () => {
        showRadioStep(2);
    });
    
    document.getElementById('radio-step-3-next')?.addEventListener('click', () => {
        showRadioStep(4);
    });
    
    // Step 4 navigation
    document.getElementById('radio-step-4-back')?.addEventListener('click', () => {
        showRadioStep(3);
    });
    
    document.getElementById('radio-step-4-next')?.addEventListener('click', () => {
        showRadioStep(5);
    });
    
    // Step 5 navigation
    document.getElementById('radio-step-5-back')?.addEventListener('click', () => {
        showRadioStep(4);
    });
    
    document.getElementById('radio-step-5-next')?.addEventListener('click', () => {
        showRadioStep(6);
    });
    
    // Step 6 navigation
    document.getElementById('radio-step-6-back')?.addEventListener('click', () => {
        showRadioStep(5);
    });
    
    // Cover image upload
    const coverUploadArea = document.getElementById('radio-cover-upload');
    const coverInput = document.getElementById('radio-cover-image');
    
    coverUploadArea?.addEventListener('click', () => coverInput.click());
    coverInput?.addEventListener('change', handleCoverImageUpload);
    
    // Validation button
    document.getElementById('validate-radio')?.addEventListener('click', () => {
        // Enable next step after validation
        document.getElementById('radio-step-4-next').disabled = false;
    });
});

function validateTrackInfo() {
    const requiredFields = ['radio-track-title', 'radio-artist-name', 'radio-genre', 'radio-language', 'radio-content-rating'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field?.value?.trim()) {
            field?.classList.add('error');
            isValid = false;
        } else {
            field?.classList.remove('error');
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields marked with *');
    }
    
    return isValid;
}

function handleCoverImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate image
    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file (JPG or PNG)');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // Check dimensions
            if (img.width < 500 || img.height < 500) {
                alert('Image must be at least 500x500 pixels');
                return;
            }
            
            // Show preview
            const preview = document.getElementById('radio-cover-preview');
            const previewImg = document.getElementById('radio-cover-img');
            const filename = document.getElementById('radio-cover-filename');
            const dimensions = document.getElementById('radio-cover-dimensions');
            const size = document.getElementById('radio-cover-size');
            
            previewImg.src = e.target.result;
            filename.textContent = file.name;
            dimensions.textContent = `${img.width} × ${img.height} pixels`;
            size.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
            
            preview.style.display = 'block';
            
            // Enable next button
            document.getElementById('radio-step-3-next').disabled = false;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Global function to trigger radio step progression from main app
window.showRadioStep = showRadioStep;