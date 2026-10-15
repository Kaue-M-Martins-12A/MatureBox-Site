// Endereço do backend (backend/src/server.js).
// Funciona tanto abrindo o site pelo próprio servidor (localhost:3333) quanto pelo Live Server.
const API_URL = "http://localhost:3333";

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
