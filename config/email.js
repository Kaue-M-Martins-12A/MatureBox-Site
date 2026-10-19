import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // O teu e-mail
    pass: process.env.EMAIL_PASS  // Senha de aplicativo do Google
  }
});

export async function enviarEmailVerificacao(emailDestino, token) {
  const urlBase = process.env.URL_BASE || "http://localhost:3333";
  const link = `${urlBase}/api/verificar?token=${token}`;

  const mailOptions = {
    from: `"MatureBox" <${process.env.EMAIL_USER}>`,
    to: emailDestino,
    subject: "Confirma o teu e-mail no MatureBox",
    html: `
      <h2>Bem-vindo ao MatureBox!</h2>
      <p>Clica no botão abaixo para ativar a tua conta:</p>
      <a href="${link}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verificar E-mail</a>
      <p>Ou acede através deste link no navegador: ${link}</p>
    `
  };

  return transporter.sendMail(mailOptions);
}