###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:22-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

# Copy all files including i18n
COPY --chown=node:node . .

# Verify i18n files are copied
RUN ls -la src/i18n/ || echo "i18n directory might not exist"

###################
# PRODUCTION
###################

FROM node:22-alpine As production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Explicitly copy i18n directory
COPY --chown=node:node --from=build /usr/src/app/src/i18n ./src/i18n

# Verify in production image
RUN ls -la src/i18n/ && echo "i18n files:" && ls -la src/i18n/*

CMD [ "node", "dist/main.js" ]