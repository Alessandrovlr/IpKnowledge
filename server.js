const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const PORT = 3000;
const URL_ANPD = "https://www.gov.br/anpd/pt-br/assuntos/noticias";

app.use(cors());

var noticias = [];

const buscarNoticias = async () => {
    try {
        console.log("Buscando notícias...");

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.goto(URL_ANPD, { waitUntil: "networkidle0" });

        const dadosNoticias = await page.evaluate(() => {
            let noticias = [];

            // Seleciona os itens de notícia dentro da classe "noticias listagem-noticias-com-foto"
            const elementos = document.querySelectorAll(".noticias.listagem-noticias-com-foto li");

            console.log("Elementos encontrados:", elementos.length); // Verifique quantos elementos foram encontrados

            elementos.forEach((elemento) => {
                // Extraindo o título e o link
                let titulo = elemento.querySelector(".titulo a")?.textContent.trim(); // Ajuste para pegar o título
                let link = elemento.querySelector(".titulo a")?.getAttribute("href"); // Pega o link da notícia

                if (titulo && link) {
                    noticias.push({
                        titulo,
                        link: link.startsWith("http") ? link : `https://www.gov.br${link}` // Completa o link se necessário
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
    res.json(noticias); // Retorna as notícias armazenadas
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    buscarNoticias(); // Atualiza as notícias assim que o servidor é iniciado
});
