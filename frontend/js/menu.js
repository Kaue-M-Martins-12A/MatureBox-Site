document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     1. MENU MOBILE (HAMBÚRGUER)
  ========================================================= */
  const navbar = document.querySelector(".navbar");
  const linksOriginais = document.querySelector(".nav-links");

  if (navbar && linksOriginais) {
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

    const menu = document.createElement("nav");
    menu.className = "menu-mobile";
    menu.setAttribute("aria-label", "Menu");
    menu.innerHTML = `<a href="./index.html">Início</a>` + linksOriginais.innerHTML + `<a href="./login.html" id="mobile-link-entrar">Entrar</a>`;

    navbar.appendChild(botao);
    navbar.appendChild(menu);

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
  const btnEntrarHeader = document.getElementById("btn-entrar-header");
  const perfilContainer = document.getElementById("perfil-container");
  const btnPerfilToggle = document.getElementById("btn-perfil-toggle");
  const perfilMenu = document.getElementById("perfil-menu");

  const avatarHeaderImg = document.getElementById("avatar-header-img");
  const avatarMenuImg = document.getElementById("avatar-menu-img");
  const inputFotoPerfil = document.getElementById("input-foto-perfil");

  // Edição de Nome
  const nomeExibicao = document.getElementById("nome-exibicao");
  const nomeEdicao = document.getElementById("nome-edicao");
  const usuarioNome = document.getElementById("usuario-nome");
  const usuarioEmail = document.getElementById("usuario-email");
  const btnEditarNome = document.getElementById("btn-editar-nome");
  const inputNovoNome = document.getElementById("input-novo-nome");
  const btnSalvarNome = document.getElementById("btn-salvar-nome");
  const btnCancelarNome = document.getElementById("btn-cancelar-nome");

  // Pareamento
  const statusPareamentoTxt = document.getElementById("status-pareamento-txt");
  const badgeStatusLed = document.getElementById("badge-status-led");
  const btnConectarBox = document.getElementById("btn-conectar-box");
  const btnDesconectarBox = document.getElementById("btn-desconectar-box");
  const boxConfirmarDesconexao = document.getElementById("box-confirmar-desconexao");
  const btnConfirmarSim = document.getElementById("btn-confirmar-sim");
  const btnConfirmarNao = document.getElementById("btn-confirmar-nao");
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

  /* Função para mascarar o código (Oculta os primeiros dígitos e mantém apenas os 2 últimos) */
  function mascararCodigoMatureBox(codigo) {
    if (!codigo) return "";
    const str = String(codigo).trim();
    if (str.length <= 2) return str;
    return "*".repeat(str.length - 2) + str.slice(-2);
  }

  /* Carregar Dados do Utilizador */
  function carregarDadosPerfil() {
    const dispositivoSalvo = localStorage.getItem("maturebox_codigo") || localStorage.getItem("maturebox_pareado");
    const dadosSalvos = JSON.parse(localStorage.getItem("dados_usuario")) || {
      nome: "Usuário MatureBox",
      email: usuarioLogado && usuarioLogado.includes("@") ? usuarioLogado : "cliente@maturebox.com.br",
      foto: null,
      dispositivo_id: dispositivoSalvo || null
    };

    if (dispositivoSalvo) {
      dadosSalvos.dispositivo_id = dispositivoSalvo;
    }

    if (usuarioNome) usuarioNome.textContent = dadosSalvos.nome;
    if (usuarioEmail) usuarioEmail.textContent = dadosSalvos.email;

    if (dadosSalvos.foto) {
      if (avatarHeaderImg) avatarHeaderImg.src = dadosSalvos.foto;
      if (avatarMenuImg) avatarMenuImg.src = dadosSalvos.foto;
    }

    atualizarStatusPareamento(dadosSalvos.dispositivo_id);
  }

  /* Atualizar Estado de Conexão do Dispositivo com Mascaramento (ex: MB-*******77) */
  function atualizarStatusPareamento(dispositivoId) {
    if (dispositivoId) {
      const codigoMascarado = mascararCodigoMatureBox(dispositivoId);
      if (statusPareamentoTxt) {
        statusPareamentoTxt.textContent = `MB-${codigoMascarado}`;
        statusPareamentoTxt.className = "status-pareamento-txt conectado";
      }
      if (badgeStatusLed) badgeStatusLed.className = "led-status-dot online";
      if (btnConectarBox) btnConectarBox.style.display = "none";
      if (btnDesconectarBox) btnDesconectarBox.style.display = "block";
    } else {
      if (statusPareamentoTxt) {
        statusPareamentoTxt.textContent = "Nenhum equipamento conectado";
        statusPareamentoTxt.className = "status-pareamento-txt desconectado";
      }
      if (badgeStatusLed) badgeStatusLed.className = "led-status-dot offline";
      if (btnConectarBox) btnConectarBox.style.display = "block";
      if (btnDesconectarBox) btnDesconectarBox.style.display = "none";
    }
  }

  // Torna acessível globalmente para chamadas de outros scripts
  window.carregarDadosPerfil = carregarDadosPerfil;
  window.atualizarStatusPareamento = atualizarStatusPareamento;

  /* Abrir / Fechar Menu do Perfil */
  if (btnPerfilToggle) {
    btnPerfilToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (perfilMenu) perfilMenu.classList.toggle("ativo");
    });

    document.addEventListener("click", (e) => {
      if (perfilMenu && !perfilMenu.contains(e.target) && !btnPerfilToggle.contains(e.target)) {
        perfilMenu.classList.remove("ativo");
        fecharModoEdicaoNome();
        fecharConfirmacaoDesconexao();
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

  /* Edição de Nome In-App */
  if (btnEditarNome) {
    btnEditarNome.addEventListener("click", () => {
      if (nomeExibicao) nomeExibicao.style.display = "none";
      if (nomeEdicao) nomeEdicao.style.display = "flex";
      if (inputNovoNome) {
        inputNovoNome.value = usuarioNome ? usuarioNome.textContent : "";
        inputNovoNome.focus();
      }
    });
  }

  function salvarNovoNome() {
    const valor = inputNovoNome ? inputNovoNome.value.trim() : "";
    if (valor !== "") {
      if (usuarioNome) usuarioNome.textContent = valor;
      const dados = JSON.parse(localStorage.getItem("dados_usuario")) || {};
      dados.nome = valor;
      localStorage.setItem("dados_usuario", JSON.stringify(dados));
    }
    fecharModoEdicaoNome();
  }

  function fecharModoEdicaoNome() {
    if (nomeEdicao) nomeEdicao.style.display = "none";
    if (nomeExibicao) nomeExibicao.style.display = "flex";
  }

  if (btnSalvarNome) btnSalvarNome.addEventListener("click", salvarNovoNome);
  if (btnCancelarNome) btnCancelarNome.addEventListener("click", fecharModoEdicaoNome);
  if (inputNovoNome) {
    inputNovoNome.addEventListener("keydown", (e) => {
      if (e.key === "Enter") salvarNovoNome();
      if (e.key === "Escape") fecharModoEdicaoNome();
    });
  }

  /* Redirecionamento Direto para o Cofre do Controle */
  if (btnConectarBox) {
    btnConectarBox.addEventListener("click", () => {
      if (perfilMenu) perfilMenu.classList.remove("ativo");

      if (window.location.pathname.includes("controle.html")) {
        const inputCodigo = document.getElementById("codigo-produto");
        if (inputCodigo) inputCodigo.focus();
      } else {
        window.location.href = "./controle.html";
      }
    });
  }

  /* Confirmação de Desconexão In-App */
  if (btnDesconectarBox) {
    btnDesconectarBox.addEventListener("click", () => {
      btnDesconectarBox.style.display = "none";
      if (boxConfirmarDesconexao) boxConfirmarDesconexao.style.display = "block";
    });
  }

  function fecharConfirmacaoDesconexao() {
    if (boxConfirmarDesconexao) boxConfirmarDesconexao.style.display = "none";
    const temDispositivo = localStorage.getItem("maturebox_codigo") || localStorage.getItem("maturebox_pareado");
    if (temDispositivo && btnDesconectarBox) {
      btnDesconectarBox.style.display = "block";
    }
  }

  if (btnConfirmarNao) btnConfirmarNao.addEventListener("click", fecharConfirmacaoDesconexao);

  if (btnConfirmarSim) {
    btnConfirmarSim.addEventListener("click", () => {
      localStorage.removeItem("maturebox_pareado");
      localStorage.removeItem("maturebox_codigo");
      sessionStorage.removeItem("cofre_desbloqueado");

      const dados = JSON.parse(localStorage.getItem("dados_usuario")) || {};
      dados.dispositivo_id = null;
      localStorage.setItem("dados_usuario", JSON.stringify(dados));

      fecharConfirmacaoDesconexao();
      atualizarStatusPareamento(null);

      if (window.location.pathname.includes("controle.html")) {
        window.location.reload();
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