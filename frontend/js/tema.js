// Carregado no <head> sem "defer": aplica o tema antes da página aparecer,
// evitando que ela pisque no tema errado.
// Usa o tema salvo; se não houver, segue a preferência do sistema.
(function () {
  const raiz = document.documentElement;

  function lerTemaSalvo() {
    try {
      return localStorage.getItem("theme");
    } catch (erro) {
      return null;
    }
  }

  function aplicar(tema) {
    raiz.setAttribute("data-theme", tema);
  }

  const salvo = lerTemaSalvo();
  const prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (salvo === "escuro" || salvo === "claro") {
    aplicar(salvo === "escuro" ? "dark" : "light");
  } else {
    aplicar(prefereEscuro ? "dark" : "light");
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".theme-toggle-btn").forEach((botao) => {
      botao.addEventListener("click", () => {
        const novo = raiz.getAttribute("data-theme") === "dark" ? "light" : "dark";
        aplicar(novo);
        try {
          localStorage.setItem("theme", novo === "dark" ? "escuro" : "claro");
        } catch (erro) {
          // Sem acesso ao armazenamento: o tema vale só para esta visita.
        }
      });
    });
  });
})();
