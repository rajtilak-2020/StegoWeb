/**
 * Tabs module
 * Handles tab switching between Result and Decode sections
 */

const initTabs = () => {
  const resultTab = document.getElementById('result-tab');
  const decodeTab = document.getElementById('decode-tab');
  const resultSection = document.getElementById('result-section');
  const decodeSection = document.getElementById('decode-section');
  
  // Switch to result tab
  resultTab.addEventListener('click', () => {
    // Update active tab
    resultTab.classList.add('text-indigo-600', 'dark:text-indigo-400', 'border-b-2', 'border-indigo-600', 'dark:border-indigo-400');
    resultTab.classList.remove('text-gray-500', 'dark:text-gray-400');
    
    decodeTab.classList.remove('text-indigo-600', 'dark:text-indigo-400', 'border-b-2', 'border-indigo-600', 'dark:border-indigo-400');
    decodeTab.classList.add('text-gray-500', 'dark:text-gray-400');
    
    // Show/hide sections
    resultSection.classList.remove('hidden');
    decodeSection.classList.add('hidden');
  });
  
  // Switch to decode tab
  decodeTab.addEventListener('click', () => {
    // Update active tab
    decodeTab.classList.add('text-indigo-600', 'dark:text-indigo-400', 'border-b-2', 'border-indigo-600', 'dark:border-indigo-400');
    decodeTab.classList.remove('text-gray-500', 'dark:text-gray-400');
    
    resultTab.classList.remove('text-indigo-600', 'dark:text-indigo-400', 'border-b-2', 'border-indigo-600', 'dark:border-indigo-400');
    resultTab.classList.add('text-gray-500', 'dark:text-gray-400');
    
    // Show/hide sections
    decodeSection.classList.remove('hidden');
    resultSection.classList.add('hidden');
  });
};

export { initTabs };