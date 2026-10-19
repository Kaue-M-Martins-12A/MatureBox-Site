document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Perfis de maturação (valores de exemplo) ---------- */
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
    temp: 8,                 // leitura atual (simulada)
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
    mensagem.textContent = texto;
    mensagem.className = `form-message ${tipo}`;
  }

  /* ---------- Desenho da tela ---------- */
  function desenharAlvos() {
    alvoTemp.textContent = estado.alvoTemp.toFixed(1);
    alvoUmid.textContent = String(Math.round(estado.alvoUmid));
    alvoTempTxt.textContent = estado.alvoTemp.toFixed(1);
    alvoUmidTxt.textContent = String(Math.round(estado.alvoUmid));
  }

  function desenharLeituras() {
    valorTemp.textContent = estado.temp.toFixed(1);
    valorUmid.textContent = estado.umid.toFixed(1);
    valorHora.textContent = new Date().toLocaleTimeString("pt-BR");

    const foraDaFaixa =
      Math.abs(estado.temp - estado.alvoTemp) > 3 ||
      Math.abs(estado.umid - estado.alvoUmid) > 10;

    ledAlerta.classList.toggle("alerta", foraDaFaixa);
  }

  function desenharReles() {
    document.querySelectorAll(".rele").forEach((item) => {
      const chave = item.querySelector(".chave");
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

    modoTxt.textContent = estado.modo === "auto" ? "Automático" : "Manual";
    desenharReles();
  }

  /* ---------- Lógica automática (liga/desliga com histerese) ---------- */
  function controleAutomatico() {
    const r = estado.reles;

    if (estado.temp > estado.alvoTemp + 0.5) { r.compressor = true; r.aquecedor = false; }
    else if (estado.temp < estado.alvoTemp - 0.5) { r.aquecedor = true; r.compressor = false; }
    else { r.compressor = false; r.aquecedor = false; }

    if (estado.umid < estado.alvoUmid - 3) { r.umidificador = true; r.exaustor = false; }
    else if (estado.umid > estado.alvoUmid + 3) { r.exaustor = true; r.umidificador = false; }
    else { r.umidificador = false; r.exaustor = false; }
  }

  /* ---------- Leitura dos sensores ----------
     DEMONSTRAÇÃO: os valores abaixo são simulados.
     Para usar o ESP32 de verdade, troque o conteúdo desta função por um
     fetch ao seu backend, por exemplo:

       const resp = await fetch(`${API_URL}/leitura`);
       const dados = await resp.json();
       estado.temp = dados.temperatura;
       estado.umid = dados.umidade;
  */
  function lerSensores() {
    const r = estado.reles;
    const ruido = () => (Math.random() - 0.5) * 0.2;

    estado.temp += (r.compressor ? -0.35 : 0) + (r.aquecedor ? 0.35 : 0) + (!r.compressor && !r.aquecedor ? 0.03 : 0) + ruido();
    estado.umid += (r.umidificador ? 1.2 : 0) + (r.exaustor ? -1.2 : 0) + (!r.umidificador && !r.exaustor ? -0.1 : 0) + ruido();

    estado.temp = limitar(estado.temp, -5, 40);
    estado.umid = limitar(estado.umid, 20, 99);
  }

  /* ---------- Envio de comandos ----------
     Troque por um POST ao backend/ESP32 para aplicar de verdade:
       enviarParaApi("/comando", { ... });
  */
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

  // Botões + e - dos valores alvo
  document.querySelectorAll(".ajuste-btn").forEach((botao) => {
    botao.addEventListener("click", () => {
      const tipo = botao.dataset.alvo;
      const passo = Number(botao.dataset.passo);

      if (tipo === "temp") {
        estado.alvoTemp = limitar(estado.alvoTemp + passo, LIMITES.temp.min, LIMITES.temp.max);
      } else {
        estado.alvoUmid = limitar(estado.alvoUmid + passo, LIMITES.umid.min, LIMITES.umid.max);
      }

      perfil.value = "personalizado";
      desenharAlvos();
    });
  });

  // Troca de perfil
  perfil.addEventListener("change", () => {
    const dados = PERFIS[perfil.value];
    if (!dados) return;

    estado.alvoTemp = dados.temp;
    estado.alvoUmid = dados.umid;
    desenharAlvos();
  });

  // Automático / Manual
  document.querySelectorAll(".modo-btn").forEach((botao) => {
    botao.addEventListener("click", () => {
      estado.modo = botao.dataset.modo;
      desenharModo();
      enviarComando(`Modo ${estado.modo === "auto" ? "automático" : "manual"} ativado.`);
    });
  });

  // Chaves dos relés (só funcionam no modo manual)
  document.querySelectorAll(".rele").forEach((item) => {
    const chave = item.querySelector(".chave");
    const nome = item.querySelector("h3").textContent;

    chave.addEventListener("click", () => {
      if (estado.modo !== "manual") return;

      const id = item.dataset.rele;
      estado.reles[id] = !estado.reles[id];
      desenharReles();
      enviarComando(`${nome} ${estado.reles[id] ? "ligado" : "desligado"}.`);
    });
  });

  // Aplicar ajustes
  el("btn-aplicar").addEventListener("click", () => {
    enviarComando(`Ajustes aplicados: ${estado.alvoTemp.toFixed(1)} °C e ${Math.round(estado.alvoUmid)}%.`);
    aviso("Ajustes aplicados com sucesso.", "sucesso");
  });

  // Parada de emergência: desliga tudo e passa para manual
  el("btn-parada").addEventListener("click", () => {
    Object.keys(estado.reles).forEach((id) => { estado.reles[id] = false; });
    estado.modo = "manual";
    desenharModo();
    enviarComando("PARADA DE EMERGÊNCIA: todas as saídas desligadas.");
    aviso("Todas as saídas foram desligadas.", "erro");
  });

  /* ---------- Início ---------- */
  desenharAlvos();
  desenharModo();
  ciclo();
  log("Painel iniciado (modo demonstração).");
  setInterval(ciclo, 2000);

});