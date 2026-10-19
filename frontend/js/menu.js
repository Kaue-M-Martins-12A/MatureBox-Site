document.addEventListener("DOMContentLoaded", function () {

    const navbar = document.querySelector(".navbar");
    const linksOriginais = document.querySelector(".nav-links");

    if (!navbar || !linksOriginais) return;

    /* Botão do menu */
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

    /* Menu: reaproveita os links do cabeçalho, com "Início" e "Entrar" */
    const menu = document.createElement("nav");

    menu.className = "menu-mobile";
    menu.setAttribute("aria-label", "Menu");

    menu.innerHTML = `<a href="./index.html">Início</a>` + linksOriginais.innerHTML + `<a href="./login.html">Entrar</a>`;

    navbar.appendChild(botao);
    navbar.appendChild(menu);

    /* Abrir / fechar */
    botao.addEventListener("click", function () {

        const aberto = menu.classList.toggle("ativo");

        botao.classList.toggle("ativo", aberto);
        botao.setAttribute("aria-expanded", String(aberto));
        botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");

    });

});
