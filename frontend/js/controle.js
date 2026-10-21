document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     1. VERIFICAÇÃO DE LOGIN
  ========================================================= */
  const usuarioLogado = localStorage.getItem("usuario_logado") || sessionStorage.getItem("usuario_logado");

  if (!usuarioLogado) {
    window.location.href = "./login.html?redirect=controle.html";
    return;
  }

  /* =========================================================
     2. LÓGICA DO COFRE E TRANCA
  ========================================================= */
  const CODIGO_CORRETO = "964666777";

  const cofreOverlay = document.getElementById("cofre-overlay");
  const cofrePainel = document.getElementById("cofre-painel");
  const cofreVolante = document.getElementById("cofre-volante");
  const cofreLed = document.getElementById("cofre-led");
  const cofreStatusTexto = document.getElementById("cofre-status-texto");
  const formCofre = document.getElementById("form-cofre");
  const inputCodigo = document.getElementById("codigo-produto");
  const cofreErro = document.getElementById("cofre-erro");

  // Se já tiver desbloqueado nesta sessão, esconde o overlay imediatamente
  if (sessionStorage.getItem("cofre_desbloqueado") === "true") {
    if (cofreOverlay) cofreOverlay.style.display = "none";
  }

  if (formCofre) {
    // Permite apenas números no campo de input
    inputCodigo.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "");
    });

    formCofre.addEventListener("submit", (e) => {
      e.preventDefault();
      const codigoDigitado = inputCodigo.value.trim();

      if (codigoDigitado === CODIGO_CORRETO) {
        // --- CÓDIGO CORRETO ---
        cofreErro.textContent = "";
        cofreStatusTexto.textContent = "DESBLOQUEANDO...";
        
        // Salva o dispositivo pareado no localStorage
        localStorage.setItem("maturebox_codigo", codigoDigitado);
        localStorage.setItem("maturebox_pareado", codigoDigitado);

        const dadosUsuario = JSON.parse(localStorage.getItem("dados_usuario")) || {};
        dadosUsuario.dispositivo_id = codigoDigitado;
        localStorage.setItem("dados_usuario", JSON.stringify(dadosUsuario));

        // Atualiza a interface do perfil no header imediatamente
        if (typeof window.carregarDadosPerfil === "function") {
          window.carregarDadosPerfil();
        } else if (typeof window.atualizarStatusPareamento === "function") {
          window.atualizarStatusPareamento(codigoDigitado);
        }

        // Gira o volante 720 graus (duas voltas completas)
        cofreVolante.style.transform = "rotate(720deg)";

        setTimeout(() => {
          cofreLed.classList.add("desbloqueado");
          cofreStatusTexto.textContent = "ACESSO CONCEDIDO";

          sessionStorage.setItem("cofre_desbloqueado", "true");

          setTimeout(() => {
            cofreOverlay.classList.add("aberto");

            setTimeout(() => {
              cofreOverlay.style.display = "none";
            }, 1200);

          }, 400);

        }, 800);

      } else {
        // --- CÓDIGO INCORRETO ---
        cofreVolante.style.transform = "rotate(-45deg)";
        cofrePainel.classList.add("shake");
        cofreErro.textContent = "CÓDIGO INCORRETO! TENTE NOVAMENTE.";
        inputCodigo.value = "";
        inputCodigo.focus();

        setTimeout(() => {
          cofreVolante.style.transform = "rotate(0deg)";
          cofrePainel.classList.remove("shake");
        }, 400);
      }
    });
  }

  /* =========================================================
     3. PAINEL DE CONTROLE - PERFIS E CONFIGURAÇÕES
  ========================================================= */
  const PERFIS = {
    carne:    { temp: 2.5, umid: 85 },
    queijo:   { temp: 12,  umid: 85 },
    embutido: { temp: 14,  umid: 75 }
  };

  const LIMITES = {
    temp: { min: 0, max: 30 },
    umid: { min: 40, max: 95 }
  };

  /* ---------- Elementos ---------- */
  const el = (id) => document.getElementById(id);

  const valorTemp = el("valor-temp");
  const valorUmid = el("valor-umid");
  const valorHora = el("valor-hora");
  const alvoTemp = el("alvo-temp");
  const alvoUmid = el("alvo-umid");
  const alvoTempTxt = el("alvo-temp-txt");
  const alvoUmidTxt = el("alvo-umid-txt");
  const modoTxt = el("modo-txt");
  const perfil = el("perfil");
  const mensagem = el("form-message");
  const registro = el("registro");
  const ledAlerta = el("led-alerta");

  /* ---------- Estado ---------- */
  const estado = {
    temp: 8,
    umid: 70,
    alvoTemp: 2.5,
    alvoUmid: 85,
    modo: "auto",
    reles: { compressor: false, aquecedor: false, umidificador: false, exaustor: false }
  };

  /* ---------- Utilidades ---------- */
  function limitar(valor, min, max) {
    return Math.min(max, Math.max(min, valor));
  }

  function log(texto) {
    if (!registro) return;
    const hora = new Date().toLocaleTimeString("pt-BR");
    const linha = document.createElement("div");
    linha.textContent = `[${hora}] ${texto}`;
    registro.appendChild(linha);

    while (registro.children.length > 60) {
      registro.removeChild(registro.firstChild);
    }
    registro.scrollTop = registro.scrollHeight;
  }

  function aviso(texto, tipo) {
    if (!mensagem) return;
    mensagem.textContent = texto;
    mensagem.className = `form-message ${tipo}`;
  }

  /* ---------- Desenho da tela ---------- */
  function desenharAlvos() {
    if (alvoTemp) alvoTemp.textContent = estado.alvoTemp.toFixed(1);
    if (alvoUmid) alvoUmid.textContent = String(Math.round(estado.alvoUmid));
    if (alvoTempTxt) alvoTempTxt.textContent = estado.alvoTemp.toFixed(1);
    if (alvoUmidTxt) alvoUmidTxt.textContent = String(Math.round(estado.alvoUmid));
  }

  function desenharLeituras() {
    if (valorTemp) valorTemp.textContent = estado.temp.toFixed(1);
    if (valorUmid) valorUmid.textContent = estado.umid.toFixed(1);
    if (valorHora) valorHora.textContent = new Date().toLocaleTimeString("pt-BR");

    const foraDaFaixa =
      Math.abs(estado.temp - estado.alvoTemp) > 3 ||
      Math.abs(estado.umid - estado.alvoUmid) > 10;

    if (ledAlerta) ledAlerta.classList.toggle("alerta", foraDaFaixa);
  }

  function desenharReles() {
    document.querySelectorAll(".rele").forEach((item) => {
      const chave = item.querySelector(".chave");
      if (!chave) return;
      const ligado = estado.reles[item.dataset.rele];

      chave.setAttribute("aria-checked", String(ligado));
      chave.disabled = estado.modo === "auto";
    });
  }

  function desenharModo() {
    document.querySelectorAll(".modo-btn").forEach((botao) => {
      const ativo = botao.dataset.modo === estado.modo;
      botao.classList.toggle("ativo", ativo);
      botao.setAttribute("aria-pressed", String(ativo));
    });

    if (modoTxt) modoTxt.textContent = estado.modo === "auto" ? "Automático" : "Manual";
    desenharReles();
  }

  /* ---------- Lógica automática ---------- */
  function controleAutomatico() {
    const r = estado.reles;

    if (estado.temp > estado.alvoTemp + 0.5) { r.compressor = true; r.aquecedor = false; }
    else if (estado.temp < estado.alvoTemp - 0.5) { r.aquecedor = true; r.compressor = false; }
    else { r.compressor = false; r.aquecedor = false; }

    if (estado.umid < estado.alvoUmid - 3) { r.umidificador = true; r.exaustor = false; }
    else if (estado.umid > estado.alvoUmid + 3) { r.exaustor = true; r.umidificador = false; }
    else { r.umidificador = false; r.exaustor = false; }
  }

  /* ---------- Leitura dos sensores (Simulada) ---------- */
  function lerSensores() {
    const r = estado.reles;
    const ruido = () => (Math.random() - 0.5) * 0.2;

    estado.temp += (r.compressor ? -0.35 : 0) + (r.aquecedor ? 0.35 : 0) + (!r.compressor && !r.aquecedor ? 0.03 : 0) + ruido();
    estado.umid += (r.umidificador ? 1.2 : 0) + (r.exaustor ? -1.2 : 0) + (!r.umidificador && !r.exaustor ? -0.1 : 0) + ruido();

    estado.temp = limitar(estado.temp, -5, 40);
    estado.umid = limitar(estado.umid, 20, 99);
  }

  /* ---------- Envio de comandos ---------- */
  function enviarComando(descricao) {
    log(descricao);
  }

  /* ---------- Ciclo principal ---------- */
  function ciclo() {
    lerSensores();
    if (estado.modo === "auto") controleAutomatico();
    desenharLeituras();
    desenharReles();
  }

  /* ---------- Eventos ---------- */

  // Botões + e -
  document.querySelectorAll(".ajuste-btn").forEach((botao) => {
    botao.addEventListener("click", () => {
      const tipo = botao.dataset.alvo;
      const passo = Number(botao.dataset.passo);

      if (tipo === "temp") {
        estado.alvoTemp = limitar(estado.alvoTemp + passo, LIMITES.temp.min, LIMITES.temp.max);
      } else {
        estado.alvoUmid = limitar(estado.alvoUmid + passo, LIMITES.umid.min, LIMITES.umid.max);
      }

      if (perfil) perfil.value = "personalizado";
      desenharAlvos();
    });
  });

  // Troca de perfil
  if (perfil) {
    perfil.addEventListener("change", () => {
      const dados = PERFIS[perfil.value];
      if (!dados) return;

      estado.alvoTemp = dados.temp;
      estado.alvoUmid = dados.umid;
      desenharAlvos();
    });
  }

  // Automático / Manual
  document.querySelectorAll(".modo-btn").forEach((botao) => {
    botao.addEventListener("click", () => {
      estado.modo = botao.dataset.modo;
      desenharModo();
      enviarComando(`Modo ${estado.modo === "auto" ? "automático" : "manual"} ativado.`);
    });
  });

  // Chaves dos relés (só funcionam em modo manual)
  document.querySelectorAll(".rele").forEach((item) => {
    const chave = item.querySelector(".chave");
    if (!chave) return;
    const nome = item.querySelector("h3") ? item.querySelector("h3").textContent : "Relé";

    chave.addEventListener("click", () => {
      if (estado.modo !== "manual") return;

      const id = item.dataset.rele;
      estado.reles[id] = !estado.reles[id];
      desenharReles();
      enviarComando(`${nome} ${estado.reles[id] ? "ligado" : "desligado"}.`);
    });
  });

  // Aplicar ajustes
  const btnAplicar = el("btn-aplicar");
  if (btnAplicar) {
    btnAplicar.addEventListener("click", () => {
      enviarComando(`Ajustes aplicados: ${estado.alvoTemp.toFixed(1)} °C e ${Math.round(estado.alvoUmid)}%.`);
      aviso("Ajustes aplicados com sucesso.", "sucesso");
    });
  }

  // Parada de emergência
  const btnParada = el("btn-parada");
  if (btnParada) {
    btnParada.addEventListener("click", () => {
      Object.keys(estado.reles).forEach((id) => { estado.reles[id] = false; });
      estado.modo = "manual";
      desenharModo();
      enviarComando("PARADA DE EMERGÊNCIA: todas as saídas desligadas.");
      aviso("Todas as saídas foram desligadas.", "erro");
    });
  }

  /* ---------- Início ---------- */
  desenharAlvos();
  desenharModo();
  ciclo();
  log("Painel iniciado (modo demonstração).");
  setInterval(ciclo, 2000);

});