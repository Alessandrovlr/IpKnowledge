// Fazendo uma requisição para pegar as notícias do servidor
fetch("http://localhost:3000/noticias")

     .then(response => response.json())
     .then(noticias => {
         console.log(noticias);  // Agora as notícias são exibidas no console
     })
     .catch(error => {
         console.error("Erro ao buscar notícias:", error);
     });

