// index.js
const express = require('express');
const { rasparDados } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

// Aumenta o limite do JSON (cookies são grandes)
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => res.json({ msg: 'API Scraper v1.3 Online' }));

app.post('/api/scrape', async (req, res) => {
    // Agora aceitamos "cookies" no corpo
    const { url, cookies } = req.body;

    if (!url) {
        return res.status(400).json({ sucesso: false, erro: 'URL obrigatória' });
    }

    try {
        // Passa os cookies para a função
        const resultado = await rasparDados(url, cookies);
        res.json(resultado);

    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));