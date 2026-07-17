import CryptoJS from 'crypto-js';

// Convert text to binary string
export const textToBinary = (text) => {
  let binary = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    binary += charCode.toString(2).padStart(8, '0');
  }
  return binary;
};

// Convert binary string back to text
export const binaryToText = (binary) => {
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    const charCode = parseInt(byte, 2);
    text += String.fromCharCode(charCode);
  }
  return text;
};

// Advanced AES-256 encryption
export const encryptMessage = (message, password) => {
  return CryptoJS.AES.encrypt(message, password).toString();
};

// Advanced AES-256 decryption
export const decryptMessage = (encrypted, password) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, password);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const encodeMessageInImage = (imageData, message, password) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.drawImage(imageData.element, 0, 0);
  
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imgData.data;
  
  let processedMessage = message + '###END###';
  if (password) {
    processedMessage = encryptMessage(processedMessage, password);
    // Add a flag to indicate it's encrypted so decoding knows what to do
    processedMessage = 'AES|' + processedMessage;
  } else {
    processedMessage = 'RAW|' + processedMessage;
  }
  
  const binaryMessage = textToBinary(processedMessage);
  const maxBits = pixels.length - (pixels.length % 4); 
  
  if (binaryMessage.length > maxBits / 4) { 
    throw new Error('The message is too large for this image. Please use a larger image or a shorter message.');
  }
  
  let binaryIndex = 0;
  const lengthBinary = binaryMessage.length.toString(2).padStart(32, '0');
  
  for (let i = 0; i < 32; i++) {
    const pixelIndex = i * 4;
    pixels[pixelIndex] = (pixels[pixelIndex] & 0xFE) | parseInt(lengthBinary[i], 2);
  }
  
  for (let i = 32 * 4; i < pixels.length - 3 && binaryIndex < binaryMessage.length; i += 4) {
    for (let j = 0; j < 3 && binaryIndex < binaryMessage.length; j++) {
      pixels[i + j] = (pixels[i + j] & 0xFE) | parseInt(binaryMessage[binaryIndex], 2);
      binaryIndex++;
    }
  }
  
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
};

export const decodeMessageFromImage = (imageData, password) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.drawImage(imageData.element, 0, 0);
  
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imgData.data;
  
  let lengthBinary = '';
  for (let i = 0; i < 32; i++) {
    const pixelIndex = i * 4;
    lengthBinary += (pixels[pixelIndex] & 0x01).toString();
  }
  
  const messageLength = parseInt(lengthBinary, 2);
  
  if (isNaN(messageLength) || messageLength <= 0 || messageLength > (pixels.length / 4) * 3) {
    throw new Error('No hidden message found or the image format is not compatible.');
  }
  
  let binaryMessage = '';
  let binaryIndex = 0;
  
  for (let i = 32 * 4; i < pixels.length - 3 && binaryIndex < messageLength; i += 4) {
    for (let j = 0; j < 3 && binaryIndex < messageLength; j++) { 
      binaryMessage += (pixels[i + j] & 0x01).toString();
      binaryIndex++;
    }
  }
  
  let message = binaryToText(binaryMessage);
  
  // Check format
  if (message.startsWith('AES|')) {
    if (!password) {
      throw new Error('This message is encrypted. Please provide a password.');
    }
    const encryptedContent = message.substring(4);
    try {
      const decrypted = decryptMessage(encryptedContent, password);
      if (!decrypted) throw new Error();
      message = decrypted;
    } catch (error) {
      throw new Error('Invalid password or corrupted data.');
    }
  } else if (message.startsWith('RAW|')) {
    message = message.substring(4);
  } else {
    throw new Error('Invalid message format.');
  }
  
  const endMarker = '###END###';
  const endIndex = message.indexOf(endMarker);
  
  if (endIndex === -1) {
    throw new Error('Invalid message format or corrupted data.');
  }
  
  return message.substring(0, endIndex);
};
