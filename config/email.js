import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmailVerificacao(emailDestino, token) {
  const urlBase = process.env.URL_BASE || "http://localhost:3333";
  const linkVerificacao = `${urlBase}/api/verificar?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "MatureBox <nao-responda@matureboxinc.com.br>", // Novo remetente com seu domínio próprio!
    to: emailDestino,
    subject: "Ative a sua conta no MatureBox",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #d97706;">Bem-vindo ao MatureBox!</h2>
        <p>Para ativar a sua conta e começar a utilizar a plataforma, clique no botão abaixo:</p>
        <p style="margin: 25px 0;">
          <a href="${linkVerificacao}" style="background-color: #d97706; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Ativar Minha Conta
          </a>
        </p>
        <p style="font-size: 0.85em; color: #666;">Se não solicitou este registo, pode ignorar este e-mail.</p>
      </div>
    `
  });

  if (error) {
    console.error("Erro no envio do Resend:", error);
    throw new Error(error.message);
  }

  return data;
}