// Caminho relativo: funciona automaticamente no localhost e no Railway
const API_URL = "/api";

async function enviarParaApi(rota, dados) {
  const resposta = await fetch(`${API_URL}${rota}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  const corpo = await resposta.json().catch(() => ({}));

  return { ok: resposta.ok, mensagem: corpo.mensagem || corpo.message, dados: corpo };
}

function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `form-message ${tipo}`;
}