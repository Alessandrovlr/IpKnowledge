const express = require("express");
const puppeteer = require('puppeteer-core');
const cors = require("cors");

const app = express();
const PORT = 3000;
const URL_ANPD = "https://www.gov.br/anpd/pt-br/assuntos/noticias";

app.use(cors());

var noticias = [];

const buscarNoticias = async () => {
    try {
        console.log("Buscando notícias...");

        const browser = await puppeteer.launch({
            executablePath: '/opt/render/.cache/puppeteer/chrome/linux-134.0.6998.35/chrome-linux64/chrome',
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();

        await page.goto(URL_ANPD, { waitUntil: "networkidle0" });

        const dadosNoticias = await page.evaluate(() => {
            let noticias = [];
            const elementos = document.querySelectorAll(".noticias.listagem-noticias-com-foto li");

            console.log("Elementos encontrados:", elementos.length);
            elementos.forEach((elemento) => {
               
                let titulo = elemento.querySelector(".titulo a")?.textContent.trim();
                let link = elemento.querySelector(".titulo a")?.getAttribute("href");

                if (titulo && link) {
                    noticias.push({
                        titulo,
                        link: link.startsWith("http") ? link : `https://www.gov.br${link}`
                    });
                }
            });

            return noticias;
        });

        noticias = dadosNoticias; 
        console.log("Notícias atualizadas:", noticias);

        await browser.close();

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
});
