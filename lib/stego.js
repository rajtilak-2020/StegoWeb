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

// Simple XOR encryption
export const encryptMessage = (message, password) => {
  let encrypted = '';
  for (let i = 0; i < message.length; i++) {
    const charCode = message.charCodeAt(i);
    const passChar = password.charCodeAt(i % password.length);
    encrypted += String.fromCharCode(charCode ^ passChar);
  }
  return encrypted;
};

// Simple XOR decryption
export const decryptMessage = (encrypted, password) => {
  return encryptMessage(encrypted, password); 
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
  
  if (password) {
    try {
      message = decryptMessage(message, password);
    } catch (error) {
      throw new Error('Invalid password or the message is not encrypted.');
    }
  }
  
  const endMarker = '###END###';
  const endIndex = message.indexOf(endMarker);
  
  if (endIndex === -1) {
    throw new Error('Invalid message format or wrong password.');
  }
  
  return message.substring(0, endIndex);
};
