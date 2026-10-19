document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const mensagem = document.getElementById("form-message");
  const botao = form.querySelector(".btn-submit");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usuario = document.getElementById("username").value.trim();
    const senha = document.getElementById("password").value;

    if (!usuario || !senha) {
      mostrarMensagem(mensagem, "Preencha usuário e senha.", "erro");
      return;
    }

    botao.disabled = true;

    try {
      const resposta = await enviarParaApi("/login", { usuario, senha });

      if (!resposta.ok) {
        mostrarMensagem(mensagem, resposta.mensagem || "Não foi possível entrar.", "erro");
        return;
      }

      localStorage.setItem("usuarioLogado", JSON.stringify(resposta.dados.usuario));
      mostrarMensagem(mensagem, resposta.mensagem, "sucesso");

      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1000);
    } catch (erro) {
      mostrarMensagem(mensagem, "Servidor indisponível. Verifique se o backend está rodando.", "erro");
    } finally {
      botao.disabled = false;
    }
  });
});
