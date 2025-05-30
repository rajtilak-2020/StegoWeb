/**
 * Theme management module
 * Handles the light/dark mode toggle functionality
 */

// Check if user has a saved theme preference or prefers dark mode
const initTheme = () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Check for saved theme preference or prefer-color-scheme
  const isDarkMode = localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Set initial theme
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Toggle theme when button is clicked
  themeToggleBtn.addEventListener('click', toggleTheme);
};

// Toggle between light and dark themes
const toggleTheme = () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
};

export { initTheme };