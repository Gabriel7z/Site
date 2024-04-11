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

   
    window.addEventListener('scroll', verificarElementos);

    // Verifica os elementos visíveis inicialmente ao carregar a página
    verificarElementos();

    // Seleciona o item "Roupas"
    var roupasItem = document.querySelector('.roupas');

    // Seleciona o submenu
    var subMenu = document.querySelector('.sub-menu');

    // Adiciona um evento de clique ao item "Roupas"
    roupasItem.addEventListener('click', function() {
        // Verifica se o submenu está visível ou não
        var subMenuDisplay = window.getComputedStyle(subMenu).getPropertyValue('display');

        // Alterna a classe "clicked" com base na visibilidade atual do submenu
        if (subMenuDisplay === 'none') {
            roupasItem.classList.add('clicked');
        } else {
            roupasItem.classList.remove('clicked');
        }
    });
});
