---
title: "Cloud Deployment (Built-in Storage)"
translation_pending: false
---

# Cloud Deployment (Built-in Storage)

When the platform can keep a disk for the container, use the volumes already declared by Compose to store the configuration and credentials. Do not enable remote storage.

## Scenario

You do not have a separate database, object store, or Git repository. You only want the configuration file and the authentication directory to remain after the container restarts. Clicks in a cloud-vendor console are not behavior of this product. This page does not describe them.

## Steps

1. Start with [Run with Docker Compose](/docker/docker). Mounts for the configuration file, authentication directory, logs, and plugin directory follow that page.
2. Where the authentication directory sits in the configuration is in [OAuth directory, aliases, and exclusions](/accounts/oauth). The mount target must match the directory on that page. Do not invent another path on this page.
3. If the platform sets `DEPLOY` to `cloud`, whether the process enters the wait follows the process behavior described on the Compose page. This page does not add wait conditions.
4. When writing configuration into the volume, the client key, management endpoint, and listener are still in [Client API keys](/api/access), [Management settings](/operations/management-settings), and [Listener and process](/operations/server).
5. Confirm the process with [Health checks](/operations/health). Do not replace the liveness check with one model request.
6. If there is in fact no persistent disk, stop this scenario and follow [Cloud deployment (database storage)](/hands-on/tutorial-8), [Cloud deployment (object storage)](/hands-on/tutorial-9), or [Cloud deployment (Git storage)](/hands-on/tutorial-10).

## What not to finish on this page

Do not list environment variables for a database, object storage, or Git. Enabling them is no longer built-in storage.
