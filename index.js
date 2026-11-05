document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeToggles = document.querySelectorAll('#theme-toggle, .theme-toggle-btn, .theme-toggle');

  // Ícones SVG para a Lua e para o Sol
  const luaSVG = `<svg class="icon lua" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  const solSVG = `<svg class="icon sol" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

  // Injeta automaticamente os dois ícones nos botões de tema das páginas
  themeToggles.forEach(btn => {
    if (btn.tagName === 'BUTTON' || btn.tagName === 'A') {
      btn.innerHTML = luaSVG + solSVG;
      btn.classList.add('theme-toggle-btn');
    }
  });

  // Função para aplicar o tema e atualizar o atributo do documento
  function applyTheme(isLight) {
    if (isLight) {
      body.classList.add('claro');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      body.classList.remove('claro');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  // Carrega a preferência guardada no navegador
  const savedTheme = localStorage.getItem('theme');
  const isLight = savedTheme === 'claro';
  applyTheme(isLight);

  // Alterna o tema ao clicar
  themeToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const newIsLight = !body.classList.contains('claro');
      applyTheme(newIsLight);
      localStorage.setItem('theme', newIsLight ? 'claro' : 'escuro');
    });
  });
});