FROM node:20.5.0-alpine3.18
RUN addgroup nextjs && adduser -S -G nextjs nextjs
USER nextjs
WORKDIR /app/
# Change ownership
RUN chown -R nextjs:nextjs /app/
# Set the user to nextjs
USER nextjs
COPY --chown=nextjs package*.json ./
RUN npm install
COPY --chown=nextjs . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
