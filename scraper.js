// scraper.js (Versão 1.5 - Blindagem de Tipos)
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function rasparDados(url, cookiesRaw = []) {
    console.log(`[SCRAPER] Iniciando leitura: ${url}`);
    
    // --- BLINDAGEM DE COOKIES (NOVO) ---
    // Garante que 'cookies' seja sempre um Array, mesmo que venha como texto do n8n
    let cookies = [];
    try {
        if (typeof cookiesRaw === 'string') {
            cookies = JSON.parse(cookiesRaw);
        } else if (Array.isArray(cookiesRaw)) {
            cookies = cookiesRaw;
        } else {
            console.log("[COOKIES] Formato inválido ou vazio, ignorando.");
        }
    } catch (e) {
        console.error("[COOKIES] Erro ao processar formato:", e.message);
        cookies = [];
    }
    // -----------------------------------

    const browser = await puppeteer.launch({ 
        headless: "new", 
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1920,1080',
            '--lang=pt-BR,pt'
        ] 
    });

    try {
        const page = await browser.newPage();
        
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // INJEÇÃO E LIMPEZA
        if (cookies && cookies.length > 0) {
            console.log(`[COOKIES] Processando ${cookies.length} cookies...`);
            
            const cookiesLimpos = cookies.map(c => {
                return {
                    name: c.name,
                    value: c.value,
                    domain: c.domain,
                    path: c.path || '/',
                    secure: c.secure,
                    httpOnly: c.httpOnly,
                    expires: c.expirationDate ? Math.floor(c.expirationDate) : undefined,
                    sameSite: (c.sameSite === 'no_restriction' || !c.sameSite) ? undefined : c.sameSite
                };
            });

            await page.setCookie(...cookiesLimpos);
            console.log(`[COOKIES] Injetados com sucesso!`);
        }

        console.log("Navegando...");
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

        const screenshotBase64 = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 40 });
        const pageTitle = await page.title();

        const dados = await page.evaluate(() => {
            const h1 = document.querySelector('h1.ui-pdp-title') 
                      || document.querySelector('.ui-pdp-title')
                      || document.querySelector('.ui-search-item__title');

            const metaPrice = document.querySelector('meta[itemprop="price"]');
            const priceVisual = document.querySelector('.andes-money-amount__fraction');

            let precoFinal = 0;
            if (metaPrice) {
                precoFinal = parseFloat(metaPrice.content);
            } else if (priceVisual) {
                precoFinal = parseFloat(priceVisual.innerText.replace(/\./g, '').replace(',', '.'));
            }

            return {
                titulo: h1 ? h1.innerText : 'Não encontrado',
                preco: precoFinal,
            };
        });

        await browser.close();

        return {
            sucesso: dados.titulo !== 'Não encontrado',
            titulo: dados.titulo,
            preco: dados.preco,
            page_title: pageTitle,
            status: "ativo",
            debug_screenshot: screenshotBase64 
        };

    } catch (error) {
        if (browser) await browser.close();
        return { sucesso: false, erro: error.message };
    }
}

module.exports = { rasparDados };