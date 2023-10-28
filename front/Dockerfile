FROM node:20.5.0-alpine3.18
RUN addgroup nextjs && adduser -S -G nextjs nextjs
USER nextjs
WORKDIR /app/
COPY --chown=nextjs package*.json .
RUN npm install
COPY --chown=nextjs . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

