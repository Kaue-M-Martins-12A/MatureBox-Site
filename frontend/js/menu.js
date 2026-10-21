document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     1. MENU MOBILE (HAMBÚRGUER)
  ========================================================= */
  const navbar = document.querySelector(".navbar");
  const linksOriginais = document.querySelector(".nav-links");

  if (navbar && linksOriginais) {
    /* Botão do menu hambúrguer */
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "menu-hamburguer";
    botao.setAttribute("aria-label", "Abrir menu");
    botao.setAttribute("aria-expanded", "false");

    botao.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    /* Menu mobile: junta as hiperligações originais */
    const menu = document.createElement("nav");
    menu.className = "menu-mobile";
    menu.setAttribute("aria-label", "Menu");
    menu.innerHTML = `<a href="./index.html">Início</a>` + linksOriginais.innerHTML + `<a href="./login.html" id="mobile-link-entrar">Entrar</a>`;

    navbar.appendChild(botao);
    navbar.appendChild(menu);

    /* Abrir / fechar menu mobile */
    botao.addEventListener("click", () => {
      const aberto = menu.classList.toggle("ativo");
      botao.classList.toggle("ativo", aberto);
      botao.setAttribute("aria-expanded", String(aberto));
      botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });
  }

  /* =========================================================
     2. GESTÃO DE PERFIL E PAREAMENTO DO MATUREBOX
  ========================================================= */
  const CODIGO_VALIDO = "964666777";

  /* Elementos da Interface */
  const btnEntrarHeader = document.getElementById("btn-entrar-header");
  const perfilContainer = document.getElementById("perfil-container");
  const btnPerfilToggle = document.getElementById("btn-perfil-toggle");
  const perfilMenu = document.getElementById("perfil-menu");

  const avatarHeaderImg = document.getElementById("avatar-header-img");
  const avatarMenuImg = document.getElementById("avatar-menu-img");
  const inputFotoPerfil = document.getElementById("input-foto-perfil");

  const usuarioNome = document.getElementById("usuario-nome");
  const usuarioEmail = document.getElementById("usuario-email");
  const btnEditarNome = document.getElementById("btn-editar-nome");

  const statusPareamentoTxt = document.getElementById("status-pareamento-txt");
  const btnConectarBox = document.getElementById("btn-conectar-box");
  const btnDesconectarBox = document.getElementById("btn-desconectar-box");
  const btnLogout = document.getElementById("btn-logout");
  const mobileLinkEntrar = document.getElementById("mobile-link-entrar");

  /* Verificação de Sessão */
  let usuarioLogado = localStorage.getItem("usuario_logado") || sessionStorage.getItem("usuario_logado");

  if (usuarioLogado) {
    if (btnEntrarHeader) btnEntrarHeader.style.display = "none";
    if (perfilContainer) perfilContainer.style.display = "block";
    if (mobileLinkEntrar) {
      mobileLinkEntrar.textContent = "Painel de Controle";
      mobileLinkEntrar.href = "./controle.html";
    }

    carregarDadosPerfil();
  } else {
    if (btnEntrarHeader) btnEntrarHeader.style.display = "inline-flex";
    if (perfilContainer) perfilContainer.style.display = "none";
  }

  /* Carregar Dados do Utilizador */
  function carregarDadosPerfil() {
    const dadosSalvos = JSON.parse(localStorage.getItem("dados_usuario")) || {
      nome: "Usuário MatureBox",
      email: usuarioLogado.includes("@") ? usuarioLogado : "cliente@maturebox.com.br",
      foto: null,
      dispositivo_id: localStorage.getItem("maturebox_pareado") || null
    };

    if (usuarioNome) usuarioNome.textContent = dadosSalvos.nome;
    if (usuarioEmail) usuarioEmail.textContent = dadosSalvos.email;

    if (dadosSalvos.foto) {
      if (avatarHeaderImg) avatarHeaderImg.src = dadosSalvos.foto;
      if (avatarMenuImg) avatarMenuImg.src = dadosSalvos.foto;
    }

    atualizarStatusPareamento(dadosSalvos.dispositivo_id);
  }

  /* Atualizar Estado de Conexão do Dispositivo */
  function atualizarStatusPareamento(dispositivoId) {
    if (dispositivoId) {
      if (statusPareamentoTxt) {
        statusPareamentoTxt.textContent = `● MatureBox #${dispositivoId}`;
        statusPareamentoTxt.className = "status-pareamento-txt conectado";
      }
      if (btnConectarBox) btnConectarBox.style.display = "none";
      if (btnDesconectarBox) btnDesconectarBox.style.display = "block";
    } else {
      if (statusPareamentoTxt) {
        statusPareamentoTxt.textContent = "Nenhum equipamento conectado";
        statusPareamentoTxt.className = "status-pareamento-txt desconectado";
      }
      if (btnConectarBox) btnConectarBox.style.display = "block";
      if (btnDesconectarBox) btnDesconectarBox.style.display = "none";
    }
  }

  /* Abrir / Fechar Menu do Perfil */
  if (btnPerfilToggle) {
    btnPerfilToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (perfilMenu) perfilMenu.classList.toggle("ativo");
    });

    document.addEventListener("click", (e) => {
      if (perfilMenu && !perfilMenu.contains(e.target) && !btnPerfilToggle.contains(e.target)) {
        perfilMenu.classList.remove("ativo");
      }
    });
  }

  /* Alterar Foto de Perfil */
  if (inputFotoPerfil) {
    inputFotoPerfil.addEventListener("change", (e) => {
      const arquivo = e.target.files[0];
      if (arquivo) {
        const leitor = new FileReader();
        leitor.onload = function (evento) {
          const fotoBase64 = evento.target.result;
          if (avatarHeaderImg) avatarHeaderImg.src = fotoBase64;
          if (avatarMenuImg) avatarMenuImg.src = fotoBase64;

          const dados = JSON.parse(localStorage.getItem("dados_usuario")) || {};
          dados.foto = fotoBase64;
          localStorage.setItem("dados_usuario", JSON.stringify(dados));
        };
        leitor.readAsDataURL(arquivo);
      }
    });
  }

  /* Editar Nome de Exibição */
  if (btnEditarNome) {
    btnEditarNome.addEventListener("click", () => {
      const nomeAtual = usuarioNome ? usuarioNome.textContent : "";
      const novoNome = prompt("Digite o seu nome:", nomeAtual);

      if (novoNome && novoNome.trim() !== "") {
        if (usuarioNome) usuarioNome.textContent = novoNome.trim();

        const dados = JSON.parse(localStorage.getItem("dados_usuario")) || {};
        dados.nome = novoNome.trim();
        localStorage.setItem("dados_usuario", JSON.stringify(dados));
      }
    });
  }

  /* Conectar a um Dispositivo MatureBox */
  if (btnConectarBox) {
    btnConectarBox.addEventListener("click", () => {
      const codigoInput = prompt("Digite o código de 9 dígitos do seu MatureBox:");
      if (!codigoInput) return;

      if (codigoInput.trim() === CODIGO_VALIDO) {
        alert("MatureBox conectado com sucesso!");

        localStorage.setItem("maturebox_pareado", CODIGO_VALIDO);
        sessionStorage.setItem("cofre_desbloqueado", "true");

        const dados = JSON.parse(localStorage.getItem("dados_usuario")) || {};
        dados.dispositivo_id = CODIGO_VALIDO;
        localStorage.setItem("dados_usuario", JSON.stringify(dados));

        atualizarStatusPareamento(CODIGO_VALIDO);

        const cofreOverlay = document.getElementById("cofre-overlay");
        if (cofreOverlay) cofreOverlay.style.display = "none";
      } else {
        alert("Código inválido! Verifique o número impresso no seu equipamento.");
      }
    });
  }

  /* Desconectar Dispositivo */
  if (btnDesconectarBox) {
    btnDesconectarBox.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja desconectar este MatureBox da sua conta?")) {
        localStorage.removeItem("maturebox_pareado");
        sessionStorage.removeItem("cofre_desbloqueado");

        const dados = JSON.parse(localStorage.getItem("dados_usuario")) || {};
        dados.dispositivo_id = null;
        localStorage.setItem("dados_usuario", JSON.stringify(dados));

        atualizarStatusPareamento(null);
        alert("Equipamento desconectado.");

        if (window.location.pathname.includes("controle.html")) {
          window.location.reload();
        }
      }
    });
  }

  /* Terminar Sessão (Logout) */
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("usuario_logado");
      sessionStorage.removeItem("usuario_logado");
      sessionStorage.removeItem("cofre_desbloqueado");
      window.location.href = "./index.html";
    });
  }

});