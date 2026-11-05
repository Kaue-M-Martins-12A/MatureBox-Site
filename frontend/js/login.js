document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const mensagem = document.getElementById("form-message");
  const botao = form ? form.querySelector(".btn-submit") : null;

  function mostrarMensagem(el, texto, tipo) {
    if (!el) return;
    el.textContent = texto;
    el.className = `form-message ${tipo}`;
  }

  // Verifica se o usuário foi redirecionado após confirmar o e-mail
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("verificado") === "true") {
    mostrarMensagem(mensagem, "E-mail verificado com sucesso! Já pode fazer o login.", "sucesso");
  }

  // Se já estiver logado, redireciona diretamente para o controle
  const usuarioJaLogado = localStorage.getItem("usuario_logado") || sessionStorage.getItem("usuario_logado");
  if (usuarioJaLogado && !urlParams.get("redirect")) {
    window.location.href = "./controle.html";
    return;
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const usuarioInput = document.getElementById("username");
      const senhaInput = document.getElementById("password");

      const usuario = usuarioInput ? usuarioInput.value.trim() : "";
      const senha = senhaInput ? senhaInput.value : "";

      if (!usuario || !senha) {
        mostrarMensagem(mensagem, "Preencha o usuário/e-mail e a senha.", "erro");
        return;
      }

      if (botao) botao.disabled = true;

      // Executa a autenticação e gravação local da sessão
      function realizarLoginSucesso(emailOuNome) {
        // 1. Grava a chave exata esperada pelo menu.js e controle.js
        localStorage.setItem("usuario_logado", emailOuNome);

        // 2. Prepara e salva a estrutura de dados do perfil
        const dadosExistentes = JSON.parse(localStorage.getItem("dados_usuario")) || {};
        const novosDados = {
          nome: dadosExistentes.nome || emailOuNome.split("@")[0] || "Usuário MatureBox",
          email: emailOuNome.includes("@") ? emailOuNome : `${emailOuNome}@maturebox.com.br`,
          foto: dadosExistentes.foto || null,
          dispositivo_id: localStorage.getItem("maturebox_pareado") || dadosExistentes.dispositivo_id || null
        };
        localStorage.setItem("dados_usuario", JSON.stringify(novosDados));

        mostrarMensagem(mensagem, "Login realizado com sucesso! Redirecionando...", "sucesso");

        // 3. Redireciona para o painel de controle (ou para a página solicitada)
        const destino = urlParams.get("redirect") || "controle.html";
        setTimeout(() => {
          window.location.href = `./${destino}`;
        }, 800);
      }

      try {
        // Tenta enviar para a API se a função enviarParaApi existir
        if (typeof enviarParaApi === "function") {
          const resposta = await enviarParaApi("/login", { usuario, senha });

          if (resposta && resposta.ok) {
            const emailFinal = (resposta.dados && resposta.dados.usuario) ? resposta.dados.usuario : usuario;
            realizarLoginSucesso(emailFinal);
            return;
          } else {
            // Se a API retornou erro explícito (credenciais erradas)
            mostrarMensagem(mensagem, (resposta && (resposta.mensagem || resposta.message)) || "Usuário ou senha incorretos.", "erro");
            if (botao) botao.disabled = false;
            return;
          }
        } else {
          // Fallback modo desenvolvimento / demonstração local
          realizarLoginSucesso(usuario);
        }
      } catch (erro) {
        // Se o backend estiver indisponível/offline, permite login demonstrativo
        console.warn("API offline ou indisponível. Conectando em modo local:", erro);
        realizarLoginSucesso(usuario);
      } finally {
        if (botao) botao.disabled = false;
      }
    });
  }
});