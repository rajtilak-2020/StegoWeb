/**
 * UI module
 * Handles general UI interactions like character counter, password toggle, etc.
 */

import { updateEncodeButtonState } from './upload.js';

const initUI = () => {
  // Character counter for message input
  const messageInput = document.getElementById('message-input');
  const charCounter = document.getElementById('char-counter');
  
  messageInput.addEventListener('input', () => {
    const count = messageInput.value.length;
    charCounter.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    
    // Update encode button state
    updateEncodeButtonState();
  });
  
  // Password toggle
  const usePasswordCheckbox = document.getElementById('use-password');
  const passwordInput = document.getElementById('password-input');
  
  usePasswordCheckbox.addEventListener('change', () => {
    passwordInput.disabled = !usePasswordCheckbox.checked;
    if (usePasswordCheckbox.checked) {
      passwordInput.focus();
    }
  });
};

// Show/hide loading overlay
const showLoading = (message = 'Processing your image...') => {
  const loadingOverlay = document.getElementById('loading-overlay');
  const loadingText = document.getElementById('loading-text');
  
  loadingText.textContent = message;
  loadingOverlay.classList.remove('hidden');
};

const hideLoading = () => {
  const loadingOverlay = document.getElementById('loading-overlay');
  loadingOverlay.classList.add('hidden');
};

// Show a result in the result section
const showResult = (resultImageSrc) => {
  const noResult = document.getElementById('no-result');
  const resultContent = document.getElementById('result-content');
  const resultImage = document.getElementById('result-image');
  const downloadButton = document.getElementById('download-button');
  
  // Set the result image
  resultImage.src = resultImageSrc;
  
  // Update download button
  downloadButton.href = resultImageSrc;
  downloadButton.download = 'stego-image.png';
  
  // Show the result section
  noResult.classList.add('hidden');
  resultContent.classList.remove('hidden');
  
  // Switch to result tab
  document.getElementById('result-tab').click();
};

// Show decoded message
const showDecodedMessage = (message) => {
  const decodedResult = document.getElementById('decoded-result');
  const decodedMessage = document.getElementById('decoded-message');
  
  decodedMessage.textContent = message;
  decodedResult.classList.remove('hidden');
  decodedResult.classList.add('animate-fade-in');
};

export { initUI, showLoading, hideLoading, showResult, showDecodedMessage };