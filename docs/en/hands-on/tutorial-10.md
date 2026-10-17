---
title: "Cloud Deployment (Git Storage)"
translation_pending: false
---

# Cloud Deployment (Git Storage)

When the container disk is unreliable, store the configuration and tokens in a Git repository, then call the proxy in the normal way.

## Scenario

The Git remote address and authentication are opened by environment variables. Remote storage has no covered feature page. This page does not list variable names, whether they are required, or the startup order, and it does not treat an uncovered old page as the checklist.

## Steps

1. Do not write a personal access token into the tutorial or the repository. When preparing variables, do not use this page or an uncovered old storage page as the checklist.
2. When calling the GitHub API, which of the token in the configuration and `GITSTORE_GIT_TOKEN` wins is defined only by the `server.github-token` description in [Listener and process](/operations/server). Do not rewrite that priority on this page.
3. Still start the process with [Run with Docker Compose](/docker/docker). That page says the cloud-deployment wait is entered only when `DEPLOY` is `cloud`. Do not explain the wait further on this page.
4. Access rules for the management password follow [Management settings](/operations/management-settings).
5. Configuration stored in the repository is still ordinary configuration. The client key is in [Client API keys](/api/access), the upstream key is in [Upstream API keys](/accounts/api-keys-api), and the credential directory is in [OAuth directory, aliases, and exclusions](/accounts/oauth).
6. Process listening is in [Listener and process](/operations/server). After it is up, use [Health checks](/operations/health).

## What not to finish on this page

Do not write the click flow for creating a repository on a Git host, and do not give a real repository address or token.
