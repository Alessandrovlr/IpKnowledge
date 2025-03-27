const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = 3000;
const URL_ANPD = "https://www.gov.br/anpd/pt-br/assuntos/noticias";


app.use(cors());


let noticias = [];


const buscarNoticias = async () => {
    try {
        console.log("Buscando notícias...");
        
        
        const { data } = await axios.get(URL_ANPD, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        
        const $ = cheerio.load(data);
        
        
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

        
        noticias = dadosNoticias;
        console.log("Notícias atualizadas:", noticias);
    } catch (error) {
        console.error("Erro ao buscar notícias:", error.message);
    }
};


app.get("/noticias", (req, res) => {
    res.json(noticias);
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    
    
    buscarNoticias();

   
    setInterval(buscarNoticias, 600000);
});
