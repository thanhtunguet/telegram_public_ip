FROM node:16-alpine

COPY package.json yarn.lock ./
RUN yarn install --production

CMD ["yarn", "start"]
