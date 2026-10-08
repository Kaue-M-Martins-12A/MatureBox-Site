document.addEventListener("DOMContentLoaded", function () {

    const imagem = document.getElementById("imagemComponentes");
    const imagemAmpliada = document.getElementById("imagemAmpliada");
    const fechar = document.getElementById("fecharImagem");

    if (!imagem || !imagemAmpliada || !fechar) return;

    imagem.addEventListener("click", function () {
        imagemAmpliada.classList.add("ativo");
    });

    fechar.addEventListener("click", function () {
        imagemAmpliada.classList.remove("ativo");
    });

    imagemAmpliada.addEventListener("click", function (event) {
        if (event.target === imagemAmpliada) {
            imagemAmpliada.classList.remove("ativo");
        }
    });

});