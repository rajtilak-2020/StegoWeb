/**
 * Upload module
 * Handles image uploads for both encoding and decoding
 */

let encodeImageData = null;
let decodeImageData = null;

const initUpload = () => {
  // Encode section upload elements
  const uploadContainer = document.getElementById('upload-container');
  const fileInput = document.getElementById('file-input');
  const uploadPreview = document.getElementById('upload-preview');
  const uploadPrompt = document.getElementById('upload-prompt');
  const previewImage = document.getElementById('preview-image');
  const imageDetails = document.getElementById('image-details');
  const changeImageBtn = document.getElementById('change-image');
  
  // Decode section upload elements
  const decodeUploadContainer = document.getElementById('decode-upload-container');
  const decodeFileInput = document.getElementById('decode-file-input');
  const decodePreview = document.getElementById('decode-preview');
  const decodeUploadPrompt = document.getElementById('decode-upload-prompt');
  const decodePreviewImage = document.getElementById('decode-preview-image');
  const changeDecodeImageBtn = document.getElementById('change-decode-image');
  
  // Set up encode image upload
  uploadContainer.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => handleImageUpload(e, previewImage, uploadPrompt, uploadPreview, imageDetails, true));
  changeImageBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });
  
  // Set up decode image upload
  decodeUploadContainer.addEventListener('click', () => decodeFileInput.click());
  decodeFileInput.addEventListener('change', (e) => handleImageUpload(e, decodePreviewImage, decodeUploadPrompt, decodePreview, null, false));
  changeDecodeImageBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    decodeFileInput.click();
  });
  
  // Set up drag and drop for encode
  setupDragAndDrop(uploadContainer, (e) => handleImageUpload(e, previewImage, uploadPrompt, uploadPreview, imageDetails, true));
  
  // Set up drag and drop for decode
  setupDragAndDrop(decodeUploadContainer, (e) => handleImageUpload(e, decodePreviewImage, decodeUploadPrompt, decodePreview, null, false));
};

const setupDragAndDrop = (container, handler) => {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    container.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(eventName => {
    container.addEventListener(eventName, () => {
      container.classList.add('border-indigo-500');
      container.classList.add('bg-indigo-50', 'dark:bg-indigo-900/10');
    });
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    container.addEventListener(eventName, () => {
      container.classList.remove('border-indigo-500');
      container.classList.remove('bg-indigo-50', 'dark:bg-indigo-900/10');
    });
  });
  
  container.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length) {
      const fakeEvent = { target: { files } };
      handler(fakeEvent);
    }
  });
};

const handleImageUpload = (event, previewImg, promptElem, previewElem, detailsElem, isEncode) => {
  const file = event.target.files[0];
  
  if (!file) return;
  
  // Check if file is an image
  if (!file.type.match('image.*')) {
    alert('Please select an image file (JPEG or PNG recommended).');
    return;
  }
  
  // Check file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size exceeds 5MB. Please choose a smaller image.');
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const img = new Image();
    
    img.onload = () => {
      // Show preview
      previewImg.src = img.src;
      promptElem.classList.add('hidden');
      previewElem.classList.remove('hidden');
      
      // Update image details if available
      if (detailsElem) {
        detailsElem.textContent = `${file.name} (${img.width}×${img.height})`;
      }
      
      // Store the image data in the appropriate variable
      if (isEncode) {
        encodeImageData = {
          element: img,
          width: img.width,
          height: img.height,
          name: file.name
        };
        
        // Enable encode button
        updateEncodeButtonState();
      } else {
        decodeImageData = {
          element: img,
          width: img.width,
          height: img.height,
          name: file.name
        };
        
        // Enable decode button
        document.getElementById('decode-button').disabled = false;
      }
    };
    
    img.src = e.target.result;
  };
  
  reader.readAsDataURL(file);
};

// Update encode button state based on form values
const updateEncodeButtonState = () => {
  const messageInput = document.getElementById('message-input');
  const encodeButton = document.getElementById('encode-button');
  
  encodeButton.disabled = !encodeImageData || !messageInput.value.trim();
};

// Get image data for encoding/decoding
const getEncodeImageData = () => encodeImageData;
const getDecodeImageData = () => decodeImageData;

export { initUpload, getEncodeImageData, getDecodeImageData, updateEncodeButtonState };