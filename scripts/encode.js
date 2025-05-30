/**
 * Encode module
 * Handles the LSB steganography encoding process
 */

import { getEncodeImageData } from './upload.js';
import { showLoading, hideLoading, showResult } from './ui.js';
import { encryptMessage, textToBinary } from './utils.js';

const initEncoding = () => {
  const encodeButton = document.getElementById('encode-button');
  const messageInput = document.getElementById('message-input');
  const usePasswordCheckbox = document.getElementById('use-password');
  const passwordInput = document.getElementById('password-input');
  
  encodeButton.addEventListener('click', async () => {
    // Get required data
    const imageData = getEncodeImageData();
    const message = messageInput.value.trim();
    const usePassword = usePasswordCheckbox.checked;
    const password = usePassword ? passwordInput.value : '';
    
    // Validate input
    if (!imageData || !message) {
      alert('Please select an image and enter a message.');
      return;
    }
    
    // Show loading overlay
    showLoading('Encoding your message...');
    
    // Process the encoding with a small delay to allow UI to update
    setTimeout(() => {
      try {
        // Encode the message
        const resultImageSrc = encodeMessageInImage(imageData, message, password);
        
        // Show the result
        showResult(resultImageSrc);
      } catch (error) {
        alert(`Error encoding message: ${error.message}`);
        console.error(error);
      } finally {
        hideLoading();
      }
    }, 100);
  });
};

const encodeMessageInImage = (imageData, message, password) => {
  // Create a canvas to work with the image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions to match the image
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  
  // Draw the image on the canvas
  ctx.drawImage(imageData.element, 0, 0);
  
  // Get image data from the canvas
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imgData.data;
  
  // Process the message - add delimiter and encrypt if password provided
  let processedMessage = message + '###END###';
  if (password) {
    processedMessage = encryptMessage(processedMessage, password);
  }
  
  // Convert message to binary
  const binaryMessage = textToBinary(processedMessage);
  
  // Check if the image has enough capacity for the message
  const maxBits = pixels.length - (pixels.length % 4); // Ensure we don't go out of bounds
  if (binaryMessage.length > maxBits / 4) { // We only use 1 bit per RGBA component
    throw new Error('The message is too large for this image. Please use a larger image or a shorter message.');
  }
  
  // Embed the binary message into the image using LSB
  let binaryIndex = 0;
  
  // First, store the length of the binary message in the first 32 pixels
  // This will allow us to know how many bits to read when decoding
  const lengthBinary = binaryMessage.length.toString(2).padStart(32, '0');
  
  for (let i = 0; i < 32; i++) {
    // Use only the R channel for the length (every 4th pixel starting at 0)
    const pixelIndex = i * 4;
    
    // Set the least significant bit of the R channel
    pixels[pixelIndex] = (pixels[pixelIndex] & 0xFE) | parseInt(lengthBinary[i], 2);
  }
  
  // Now store the actual message, starting after the length data
  // Skip alpha channel (every 4th value) as it's often used for transparency
  for (let i = 32 * 4; i < pixels.length - 3 && binaryIndex < binaryMessage.length; i += 4) {
    for (let j = 0; j < 3 && binaryIndex < binaryMessage.length; j++) { // Only modify R, G, B (not A)
      // Set the least significant bit of this color channel
      pixels[i + j] = (pixels[i + j] & 0xFE) | parseInt(binaryMessage[binaryIndex], 2);
      binaryIndex++;
    }
  }
  
  // Put the modified pixel data back on the canvas
  ctx.putImageData(imgData, 0, 0);
  
  // Return the data URL of the resulting image
  return canvas.toDataURL('image/png');
};

export { initEncoding };