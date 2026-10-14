document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeToggles = document.querySelectorAll('.theme-toggle, .theme-toggle-btn, .theme-switch input');

  // 1. Carrega o tema salvo no localStorage ao abrir a página
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'claro') {
    body.classList.add('claro');
    document.documentElement.setAttribute('data-theme', 'light');
    syncInputs(true);
  } else {
    body.classList.remove('claro');
    document.documentElement.setAttribute('data-theme', 'dark');
    syncInputs(false);
  }

  // Função para sincronizar inputs do tipo switch (checkbox)
  function syncInputs(isLight) {
    themeToggles.forEach(toggle => {
      if (toggle.type === 'checkbox') {
        toggle.checked = isLight;
      }
    });
  }

  // 2. Alterna o tema ao clicar nos botões ou switches
  themeToggles.forEach(toggle => {
    toggle.addEventListener('change', handleToggle);
    toggle.addEventListener('click', (e) => {
      if (toggle.type !== 'checkbox') {
        handleToggle();
      }
    });
  });

  function handleToggle() {
    const isLight = body.classList.toggle('claro');

    if (isLight) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'claro');
      syncInputs(true);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'escuro');
      syncInputs(false);
    }
  }
});