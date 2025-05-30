/**
 * Decode module
 * Handles the LSB steganography decoding process
 */

import { getDecodeImageData } from './upload.js';
import { showLoading, hideLoading, showDecodedMessage } from './ui.js';
import { decryptMessage, binaryToText } from './utils.js';

const initDecoding = () => {
  const decodeButton = document.getElementById('decode-button');
  const passwordInput = document.getElementById('decode-password-input');
  
  // Initially disable the decode button
  decodeButton.disabled = true;
  
  decodeButton.addEventListener('click', async () => {
    // Get required data
    const imageData = getDecodeImageData();
    const password = passwordInput.value;
    
    // Validate input
    if (!imageData) {
      alert('Please select an image to decode.');
      return;
    }
    
    // Show loading overlay
    showLoading('Decoding hidden message...');
    
    // Process the decoding with a small delay to allow UI to update
    setTimeout(() => {
      try {
        // Decode the message
        const message = decodeMessageFromImage(imageData, password);
        
        // Show the decoded message
        showDecodedMessage(message);
      } catch (error) {
        alert(`Error decoding message: ${error.message}`);
        console.error(error);
      } finally {
        hideLoading();
      }
    }, 100);
  });
};

const decodeMessageFromImage = (imageData, password) => {
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
  
  // First, read the length of the binary message from the first 32 pixels
  let lengthBinary = '';
  
  for (let i = 0; i < 32; i++) {
    // Use only the R channel for the length (every 4th pixel starting at 0)
    const pixelIndex = i * 4;
    
    // Get the least significant bit of the R channel
    lengthBinary += (pixels[pixelIndex] & 0x01).toString();
  }
  
  // Convert binary length to decimal
  const messageLength = parseInt(lengthBinary, 2);
  
  // Validate message length
  if (isNaN(messageLength) || messageLength <= 0 || messageLength > (pixels.length / 4) * 3) {
    throw new Error('No hidden message found or the image format is not compatible.');
  }
  
  // Extract the binary message
  let binaryMessage = '';
  let binaryIndex = 0;
  
  // Skip alpha channel (every 4th value) as it's often used for transparency
  for (let i = 32 * 4; i < pixels.length - 3 && binaryIndex < messageLength; i += 4) {
    for (let j = 0; j < 3 && binaryIndex < messageLength; j++) { // Only read R, G, B (not A)
      // Get the least significant bit of this color channel
      binaryMessage += (pixels[i + j] & 0x01).toString();
      binaryIndex++;
    }
  }
  
  // Convert binary back to text
  let message = binaryToText(binaryMessage);
  
  // Decrypt if password is provided
  if (password) {
    try {
      message = decryptMessage(message, password);
    } catch (error) {
      throw new Error('Invalid password or the message is not encrypted.');
    }
  }
  
  // Check for and remove the delimiter
  const endMarker = '###END###';
  const endIndex = message.indexOf(endMarker);
  
  if (endIndex === -1) {
    throw new Error('Invalid message format or wrong password.');
  }
  
  // Return the message without the delimiter
  return message.substring(0, endIndex);
};

export { initDecoding };