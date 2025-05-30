/**
 * Utilities module
 * Provides common utility functions for encoding and decoding
 */

// Convert text to binary string
const textToBinary = (text) => {
  let binary = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // Convert each character to 8-bit binary
    binary += charCode.toString(2).padStart(8, '0');
  }
  return binary;
};

// Convert binary string back to text
const binaryToText = (binary) => {
  let text = '';
  // Process 8 bits at a time
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    const charCode = parseInt(byte, 2);
    text += String.fromCharCode(charCode);
  }
  return text;
};

// Simple XOR encryption
const encryptMessage = (message, password) => {
  let encrypted = '';
  for (let i = 0; i < message.length; i++) {
    // XOR each character with the corresponding character in the password
    const charCode = message.charCodeAt(i);
    const passChar = password.charCodeAt(i % password.length);
    encrypted += String.fromCharCode(charCode ^ passChar);
  }
  return encrypted;
};

// Simple XOR decryption (same algorithm as encryption due to XOR properties)
const decryptMessage = (encrypted, password) => {
  return encryptMessage(encrypted, password); // XOR is its own inverse
};

export { textToBinary, binaryToText, encryptMessage, decryptMessage };