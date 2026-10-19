document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const mensagem = document.getElementById("form-message");
  const botao = form.querySelector(".btn-submit");

  // Deteta se o utilizador foi redirecionado após confirmar o e-mail
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("verificado") === "true") {
    mostrarMensagem(mensagem, "E-mail verificado com sucesso! Já pode fazer o login.", "sucesso");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usuario = document.getElementById("username").value.trim();
    const senha = document.getElementById("password").value;

    if (!usuario || !senha) {
      mostrarMensagem(mensagem, "Preencha utilizador e palavra-passe.", "erro");
      return;
    }

    botao.disabled = true;

    try {
      const resposta = await enviarParaApi("/login", { usuario, senha });

      if (!resposta.ok) {
        mostrarMensagem(mensagem, resposta.mensagem || resposta.message || "Não foi possível entrar.", "erro");
        return;
      }

      localStorage.setItem("usuarioLogado", JSON.stringify(resposta.dados ? resposta.dados.usuario : resposta.usuario));
      mostrarMensagem(mensagem, resposta.mensagem || resposta.message || "Login realizado com sucesso!", "sucesso");

      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1000);
    } catch (erro) {
      mostrarMensagem(mensagem, "Servidor indisponível. Verifique se o backend está a rodar.", "erro");
    } finally {
      botao.disabled = false;
    }
  });
});