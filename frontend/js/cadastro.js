document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastro-form");
  const mensagem = document.getElementById("form-message");
  const botao = form.querySelector(".btn-submit");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome_completo = document.getElementById("fullname").value.trim();
    const usuario = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value;

    if (!nome_completo || !usuario || !email || !senha) {
      mostrarMensagem(mensagem, "Preencha todos os campos.", "erro");
      return;
    }

    botao.disabled = true;

    try {
      const resposta = await enviarParaApi("/create-user", { 
        nome_completo, 
        usuario, 
        email, 
        senha 
      });

      if (!resposta.ok) {
        mostrarMensagem(mensagem, resposta.mensagem || resposta.message || "Não foi possível criar a conta.", "erro");
        return;
      }

      mostrarMensagem(
        mensagem, 
        "Conta criada com sucesso! Verifique o seu e-mail para ativar a conta.", 
        "sucesso"
      );
      form.reset();

      setTimeout(() => {
        window.location.href = "./login.html";
      }, 3000);

    } catch (erro) {
      mostrarMensagem(mensagem, "Servidor indisponível. Verifique se o backend está a rodar.", "erro");
    } finally {
      botao.disabled = false;
    }
  });
});