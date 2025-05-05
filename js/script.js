document.addEventListener("DOMContentLoaded", function() {
    noticia();
});

function noticia() {
    let titulos = document.querySelectorAll(".titulo-noticia");
    let links = document.querySelectorAll(".link-noticia");

    titulos.forEach(titulo => titulo.textContent = "Carregando notícias...");
    links.forEach(link => {
        link.textContent = "Aguarde...";
        link.removeAttribute("href");
    });

    fetch("https://api-noticias-gnub.onrender.com/noticias")
        .then(response => response.json())
        .then(noticias => {
            console.log("Notícias recebidas:", noticias);

            
            if (!Array.isArray(noticias) || noticias.length === 0) {
                mostraErroNoticias()
            }

            noticias.slice(0, titulos.length).forEach((noticia, index) => {
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
            mostraErroNoticias()
        });
}

function mostraErroNoticias() {
    document.querySelectorAll(".titulo-noticia").forEach(titulo => titulo.textContent = "Erro ao carregar notícia.");
    document.querySelectorAll(".link-noticia").forEach(link => {
        link.textContent = "Tente novamente mais tarde.";
        link.removeAttribute("href");
    });
}

function toggleMenu() {
    const menu = document.querySelector('.lista');
    menu.classList.toggle('show');
    menu.style.backgroundColor = '#2A465C'
    
}

let slideIndex = 0;

function mudarSlide(n) {
    const slides = document.querySelectorAll(".slide");
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + n + slides.length) % slides.length;
    slides[slideIndex].classList.add("active");
}