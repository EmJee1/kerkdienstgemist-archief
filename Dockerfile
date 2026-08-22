# syntax=docker/dockerfile:1

# Builds a runnable image for a single app in this monorepo.
#
#   docker build --build-arg APP=discovery -t discovery .

ARG NODE_VERSION=26.7.0

FROM node:${NODE_VERSION}-alpine AS base
ENV npm_config_update_notifier=false
ENV npm_config_fund=false
ENV npm_config_audit=false

# Reduce the monorepo to only the workspaces APP depends on, so unrelated apps
# do not invalidate the install layer below.
FROM base AS pruner
ARG APP
WORKDIR /repo

COPY package.json ./
RUN npm install --global "turbo@$(node -p 'require("./package.json").devDependencies.turbo')"

COPY . .
RUN turbo prune "@kdg/${APP}" --docker

FROM base AS builder
ARG APP
WORKDIR /app

# Manifests + pruned lockfile first: dependencies only reinstall when they change.
COPY --from=pruner /repo/out/json/ ./
RUN npm ci

COPY --from=pruner /repo/out/full/ ./
RUN npx turbo run build --filter="@kdg/${APP}"
RUN npm prune --omit=dev

FROM base AS runner
ARG APP
ENV NODE_ENV=production
# Cloud Run overrides PORT; the default keeps `docker run` usable as-is.
ENV PORT=8080
COPY --from=builder --chown=node:node /app /app
WORKDIR /app/apps/${APP}
USER node
EXPOSE 8080
CMD ["node", "dist/index.js"]
