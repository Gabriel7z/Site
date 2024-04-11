document.addEventListener('DOMContentLoaded', function() {
    var elementos = document.querySelectorAll('.apre');

    function verificarElementos() {
        elementos.forEach(function(elemento) {
            var posicao = elemento.getBoundingClientRect().top;
            var alturaTela = window.innerHeight;

            // Verifica se o elemento está visível na tela
            if (posicao < alturaTela) {
                elemento.classList.add('aparece'); // Adiciona a classe para fazer o elemento aparecer
            }
        });
    }

    // Adiciona um event listener para verificar quando a página é rolada
    window.addEventListener('scroll', verificarElementos);

    // Verifica os elementos visíveis inicialmente ao carregar a página
    verificarElementos(); 
});
