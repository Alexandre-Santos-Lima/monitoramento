# Usa a imagem oficial do Puppeteer
FROM ghcr.io/puppeteer/puppeteer:latest

# Roda como root para evitar erros de permissão na instalação
USER root

WORKDIR /usr/src/app

# Instala dependências
COPY package*.json ./
# O comando abaixo evita que o npm tente baixar o Chrome de novo (pois já tem na imagem)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install

# Copia o código
COPY . .

# Expõe a porta
EXPOSE 3000

ENV NODE_ENV=production

# --- CORREÇÃO AQUI ---
# NÃO definimos o EXECUTABLE_PATH manualmente. 
# A imagem base do puppeteer já faz isso automaticamente.

CMD ["node", "index.js"]