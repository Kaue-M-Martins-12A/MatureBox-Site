document.addEventListener("DOMContentLoaded", function () {

    const navbar = document.querySelector(".navbar");

    if (!navbar) return;



    const botao = document.createElement("div");

    botao.className = "menu-hamburguer";

    botao.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;



    const menu = document.createElement("nav");

    menu.className = "menu-mobile";

    menu.innerHTML = `
        <a href="./index.html">Início</a>
        <a href="./instrucoes.html">Instruções</a>
        <a href="./producao.html">Produção</a>
        <a href="./sobrenos.html">Sobre Nós</a>
        <a href="./referencia.html">Referências</a>
        <a href="./jogo.html">Jogar</a>
    `;


    navbar.appendChild(botao);
    navbar.appendChild(menu);


    botao.addEventListener("click", function () {

        botao.classList.toggle("ativo");
        menu.classList.toggle("ativo");

    });

});