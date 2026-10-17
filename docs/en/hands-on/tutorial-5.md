---
title: "Five: Docker Server Deployment"
translation_pending: false
---

# Five: Docker Server Deployment

On a machine that already has Docker Compose, start the service with the Compose file in the repository and run one liveness check that does not go through a model.

## Scenario

The machine can be a VPS or another host. Installing Docker itself is not a feature of this product. This page does not provide an install script.

## Steps

1. Start and stop from the repository root that contains `docker-compose.yml`, following [Run with Docker Compose](/docker/docker). Do not write another service definition or port table on this page.
2. The ports published by the container, and the host and port the process actually binds, follow that page and [Listener and process](/operations/server). If the two disagree, do not split the difference in the tutorial.
3. In the configuration mounted into the container, change the client key only as in [Client API keys](/api/access). Change the management endpoint only as in [Management settings](/operations/management-settings). Change the credential directory only as in [OAuth directory, aliases, and exclusions](/accounts/oauth).
4. After the process is up, call the health check. See [Health checks](/operations/health). That does not prove an upstream model is usable.
5. For logs or usage, see [Logs and usage](/operations/observability). To switch to HTTPS, see [TLS](/operations/tls).
6. If the disk will be lost, or you need a database, object storage, or Git, leave this page and follow the matching cloud-deployment tutorial. Those tutorials also only link to the storage pages. They do not copy the environment-variable table.

## What not to finish on this page

Do not write a clone command, do not copy the full text of `config.example.yaml`, and do not write firewall rules.
