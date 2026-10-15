document.addEventListener("DOMContentLoaded", function () {

    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    /* Botão do menu */
    const botao = document.createElement("div");

    botao.className = "menu-hamburguer";

    botao.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    /* Menu */
    const menu = document.createElement("nav");

    menu.className = "menu-mobile";

    menu.innerHTML = `
        <a href="./index.html">INÍCIO</a>
        <a href="./instrucoes.html">INSTRUÇÕES</a>
        <a href="./producao.html">PRODUÇÃO</a>
        <a href="./sobrenos.html">SOBRE NÓS</a>
        <a href="./referencia.html">REFERÊNCIAS</a>
        <a href="./jogo.html">JOGO</a>
    `;

    navbar.appendChild(botao);
    navbar.appendChild(menu);

    /* Abrir / fechar */
    botao.addEventListener("click", function () {

        botao.classList.toggle("ativo");
        menu.classList.toggle("ativo");

    });

});