const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = 3000;
const URL_ANPD = "https://www.gov.br/anpd/pt-br/assuntos/noticias";

// Middleware para permitir CORS
app.use(cors());

// Variável para armazenar as notícias
let noticias = [];

// Função para buscar as notícias
const buscarNoticias = async () => {
    try {
        console.log("Buscando notícias...");
        
        // Realiza a requisição HTTP para pegar a página
        const { data } = await axios.get(URL_ANPD);

        // Carrega o HTML com o Cheerio para manipulação
        const $ = cheerio.load(data);
        
        // Extrai as notícias do HTML
        const dadosNoticias = [];
        $(".noticias.listagem-noticias-com-foto li").each((index, element) => {
            const titulo = $(element).find(".titulo a").text().trim();
            const link = $(element).find(".titulo a").attr("href");

            if (titulo && link) {
                dadosNoticias.push({
                    titulo,
                    link: link.startsWith("http") ? link : `https://www.gov.br${link}`
                });
            }
        });

        // Atualiza a lista de notícias
        noticias = dadosNoticias;
        console.log("Notícias atualizadas:", noticias);
    } catch (error) {
        console.error("Erro ao buscar notícias:", error.message);
    }
};

// Endpoint para retornar as notícias
app.get("/noticias", (req, res) => {
    res.json(noticias);
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    
    // Busca as notícias assim que o servidor é iniciado
    buscarNoticias();

    // Atualiza as notícias a cada 10 minutos (600000ms)
    setInterval(buscarNoticias, 600000);
});
