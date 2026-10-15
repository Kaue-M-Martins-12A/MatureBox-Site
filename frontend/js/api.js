// Endereço do backend.
// TROCAR pela URL do projeto do backend na Vercel depois do deploy (mantendo o /api no final).
const API_URL_PRODUCAO = "https://SEU-BACKEND.vercel.app/api";

// Rodando no computador (Live Server ou localhost:3333), usa o backend local.
const rodandoLocalmente = ["localhost", "127.0.0.1"].includes(location.hostname);
const API_URL = rodandoLocalmente ? "http://localhost:3333/api" : API_URL_PRODUCAO;

async function enviarParaApi(rota, dados) {
  const resposta = await fetch(`${API_URL}${rota}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  const corpo = await resposta.json().catch(() => ({}));

  return { ok: resposta.ok, mensagem: corpo.message, dados: corpo };
}

function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `form-message ${tipo}`;
}
