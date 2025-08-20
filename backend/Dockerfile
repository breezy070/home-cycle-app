FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Run as non-root
RUN addgroup -S nodegrp && adduser -S nodeuser -G nodegrp
USER nodeuser

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]
