document.addEventListener("DOMContentLoaded", function() {
    noticia();
});

function noticia() {
    fetch("https://api-noticias-gnub.onrender.com/noticias")
        .then(response => response.json())
        .then(noticias => {
            console.log("Notícias recebidas:", noticias); 

            
            let titulos = document.querySelectorAll("#titulo-noticia");
            let links = document.querySelectorAll("#link-noticia");

            console.log("Titulos encontrados:", titulos.length);
            console.log("Links encontrados:", links.length);

            
            noticias.slice(0, 11).forEach((noticia, index) => {
                if (titulos[index] && links[index]) {
                    titulos[index].textContent = noticia.titulo;
                    links[index].innerHTML = `<a href="${noticia.link}" target="_blank">Leia mais</a>`;
                } else {
                    console.log("Não há elemento para notícia no índice", index);
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