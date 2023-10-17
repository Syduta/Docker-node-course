FROM node:18.18.2-buster-slim
WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm i; \
    else npm i --only=production; \
    fi
COPY . .
ENV PORT 3000
EXPOSE $PORT
CMD ["node", "index.js"]