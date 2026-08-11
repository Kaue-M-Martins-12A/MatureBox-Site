const botao = document.querySelector("#theme-toggle");

botao.addEventListener("click", () => {
    document.body.classList.toggle("claro");
});