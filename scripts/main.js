import { initTheme } from './theme.js';
import { initUpload } from './upload.js';
import { initTabs } from './tabs.js';
import { initEncoding } from './encode.js';
import { initDecoding } from './decode.js';
import { initUI } from './ui.js';

// Initialize all modules when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme toggling
  initTheme();
  
  // Initialize upload functionality
  initUpload();
  
  // Initialize tabs
  initTabs();
  
  // Initialize encoding functionality
  initEncoding();
  
  // Initialize decoding functionality
  initDecoding();
  
  // Initialize UI interactions
  initUI();
  
  console.log('StegoWeb initialized successfully!');
});