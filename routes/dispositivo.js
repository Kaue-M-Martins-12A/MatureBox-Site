import { Router } from "express";
import { timingSafeEqual } from "node:crypto";

const router = Router();

/* =========================================================
   CONFIGURAÇÃO
   Variáveis de ambiente (cadastrar no Railway > Variables):
     DEVICE_CODE  código de 9 dígitos do MatureBox
     DEVICE_KEY   chave secreta longa, só o ESP32 e o servidor sabem
========================================================= */
const LIMITES = {
  temp: { min: 0, max: 30 },
  umid: { min: 40, max: 95 }
};
const SAIDAS = ["compressor", "aquecedor", "umidificador", "exaustor"];
const ONLINE_MS = 20000; // sem notícia do ESP32 há mais que isso = offline

/* =========================================================
   ESTADO EM MEMÓRIA
   Basta para o protótipo. Se o Railway reiniciar, o ESP32
   reenvia a leitura no ciclo seguinte e o comando volta ao padrão.
========================================================= */
function todasDesligadas() {
  return Object.fromEntries(SAIDAS.map((nome) => [nome, false]));
}

const dispositivo = {
  telemetria: null,
  suportadas: [],
  visto_em: 0,
  comando: { modo: "auto", alvoTemp: 2.5, alvoUmid: 85, saidas: todasDesligadas() }
};

let ultimoLog = 0;

/* =========================================================
   UTILIDADES
========================================================= */
const ehNumero = (v) => typeof v === "number" && Number.isFinite(v);
const dentro = (v, faixa) => ehNumero(v) && v >= faixa.min && v <= faixa.max;

function iguais(a, b) {
  const A = Buffer.from(String(a ?? ""));
  const B = Buffer.from(String(b ?? ""));
  return A.length === B.length && timingSafeEqual(A, B);
}

/* =========================================================
   PROTEÇÃO DO ESP32 (código + chave do dispositivo)
========================================================= */
function exigirDispositivo(req, res, next) {
  const chave = process.env.DEVICE_KEY;
  const codigo = process.env.DEVICE_CODE;

  // Sem configuração, o servidor recusa tudo (falha "fechada").
  if (!chave || !codigo) {
    return res.status(503).json({ mensagem: "Dispositivo não configurado no servidor." });
  }
  if (!iguais(req.get("x-device-key"), chave) || !iguais(req.body && req.body.codigo, codigo)) {
    return res.status(401).json({ mensagem: "Não autorizado." });
  }
  next();
}

/* =========================================================
   PROTEÇÃO DO PAINEL (usuário logado)
   PROVISÓRIO: bloqueia tudo de propósito. Será trocado pela
   verificação do login real (JWT) quando virmos o routes/usuarios.js.
========================================================= */
function exigirLogin(req, res, next) {
  return res.status(401).json({ mensagem: "Autenticação do painel ainda não configurada." });
}

/* =========================================================
   ROTA DO ESP32
   Uma única requisição a cada ~5 s: ele manda a leitura e já
   recebe de volta o comando atual.
========================================================= */
router.post("/dispositivo/telemetria", exigirDispositivo, (req, res) => {
  const corpo = req.body || {};
  const sensorOk = corpo.sensorOk === true;

  dispositivo.telemetria = {
    temperatura: sensorOk && dentro(corpo.temperatura, { min: -40, max: 80 }) ? corpo.temperatura : null,
    umidade: sensorOk && dentro(corpo.umidade, { min: 0, max: 100 }) ? corpo.umidade : null,
    sensorOk,
    modo: corpo.modo === "manual" ? "manual" : "auto",
    saidas: Object.fromEntries(
      SAIDAS.map((nome) => [nome, Boolean(corpo.saidas && corpo.saidas[nome])])
    )
  };
  dispositivo.suportadas = Array.isArray(corpo.suportadas)
    ? corpo.suportadas.filter((nome) => SAIDAS.includes(nome))
    : [];
  dispositivo.visto_em = Date.now();

  // Um registro a cada 30 s nos logs do Railway, útil para testar.
  if (Date.now() - ultimoLog > 30000) {
    ultimoLog = Date.now();
    const t = dispositivo.telemetria;
    console.log(`[ESP32] temp=${t.temperatura} umid=${t.umidade} sensorOk=${t.sensorOk}`);
  }

  res.json(dispositivo.comando);
});

/* =========================================================
   ROTAS DO PAINEL (navegador)
========================================================= */
router.get("/estado", exigirLogin, (req, res) => {
  const idade = Date.now() - dispositivo.visto_em;
  res.json({
    online: dispositivo.visto_em > 0 && idade <= ONLINE_MS,
    visto_ha_s: dispositivo.visto_em ? Math.round(idade / 1000) : null,
    telemetria: dispositivo.telemetria,
    suportadas: dispositivo.suportadas,
    comando: dispositivo.comando
  });
});

router.post("/comando", exigirLogin, (req, res) => {
  const corpo = req.body || {};
  const novo = { ...dispositivo.comando, saidas: { ...dispositivo.comando.saidas } };

  // Parada de emergência: modo manual e tudo desligado.
  if (corpo.parada === true) {
    novo.modo = "manual";
    novo.saidas = todasDesligadas();
    dispositivo.comando = novo;
    return res.json(novo);
  }

  if (corpo.modo !== undefined) {
    if (corpo.modo !== "auto" && corpo.modo !== "manual") {
      return res.status(400).json({ mensagem: "Modo inválido." });
    }
    novo.modo = corpo.modo;
  }

  if (corpo.alvoTemp !== undefined) {
    if (!dentro(corpo.alvoTemp, LIMITES.temp)) {
      return res.status(400).json({ mensagem: `Temperatura alvo deve ficar entre ${LIMITES.temp.min} e ${LIMITES.temp.max} °C.` });
    }
    novo.alvoTemp = corpo.alvoTemp;
  }

  if (corpo.alvoUmid !== undefined) {
    if (!dentro(corpo.alvoUmid, LIMITES.umid)) {
      return res.status(400).json({ mensagem: `Umidade alvo deve ficar entre ${LIMITES.umid.min} e ${LIMITES.umid.max} %.` });
    }
    novo.alvoUmid = corpo.alvoUmid;
  }

  if (corpo.saidas !== undefined) {
    if (typeof corpo.saidas !== "object" || corpo.saidas === null) {
      return res.status(400).json({ mensagem: "Saídas inválidas." });
    }
    for (const [nome, valor] of Object.entries(corpo.saidas)) {
      if (!SAIDAS.includes(nome) || typeof valor !== "boolean") {
        return res.status(400).json({ mensagem: `Saída inválida: ${nome}.` });
      }
      novo.saidas[nome] = valor;
    }
  }

  dispositivo.comando = novo;
  res.json(novo);
});

export default router;
