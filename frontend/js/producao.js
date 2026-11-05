document.addEventListener("DOMContentLoaded", function () {

    const imagem = document.getElementById("imagemComponentes");
    const imagemAmpliada = document.getElementById("imagemAmpliada");
    const fechar = document.getElementById("fecharImagem");

    if (!imagem || !imagemAmpliada || !fechar) return;

    function abrir() {
        imagemAmpliada.classList.add("ativo");
        fechar.focus();
    }

    function fecharAmpliada() {
        imagemAmpliada.classList.remove("ativo");
        imagem.focus();
    }

    imagem.addEventListener("click", abrir);

    fechar.addEventListener("click", fecharAmpliada);

    imagemAmpliada.addEventListener("click", function (event) {
        if (event.target === imagemAmpliada) {
            fecharAmpliada();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && imagemAmpliada.classList.contains("ativo")) {
            fecharAmpliada();
        }
    });

});
