FROM node:16-alpine as base

WORKDIR /usr/src/app
# RUN npm install -g yarn
COPY package*.json /
COPY yarn.lock /
EXPOSE 1337

FROM base as production
ENV NODE_ENV=production
RUN yarn
COPY . /
CMD ["yarn", "run", "start"]

# FROM base as dev
# ENV NODE_ENV=development
# RUN yarn
# COPY . /
# CMD ["yarn", "run", "dev"]
