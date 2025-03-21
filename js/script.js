document.addEventListener("DOMContentLoaded", function() {
   noticia(); 
});

function noticia() {
    fetch("http://localhost:3000/noticias")
        .then(response => response.json())
        .then(noticias => {
            console.log(noticias); 

            
            let titulos = document.querySelectorAll("#titulo-noticia");
            let links = document.querySelectorAll("#link-noticia");

            // Limita as notícias a 11 primeiras
            noticias.slice(0, 11).forEach((noticia, index) => {
                if (titulos[index] && links[index]) {
                    titulos[index].textContent = noticia.titulo;
                    links[index].innerHTML = `<a href="${noticia.link}" target="_blank">Leia mais</a>`;
                }
            });
        })
        .catch(error => {
            console.error("Erro ao buscar notícias:", error);
        });
}


function toggleMenu() {
    const menu = document.querySelector('.lista');
    menu.classList.toggle('show');
}