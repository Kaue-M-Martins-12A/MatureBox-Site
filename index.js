const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});