---
title: "Docker"
related_feature_ids:
  - cli.server.config
  - mode.docker.compose
  - oauth.auth-dir.value
source_issues:
  - 32
  - 305
  - 403
  - 2009
  - 2450
  - 2682
  - 2950
  - 3272
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Docker

## Scope and limits

The practices on this page are checked only against configuration, routes, or commands that still exist in pinned commit `911f49cbd49f4fe2516979754a7488a3fd14fe64`. This page is not an official behavior promise. Keys, cookies, email addresses, authorization files, and user request bodies were not copied in.

## Short practices

- <a id="exp-docker-mount-real-config"></a>**Mount a real configuration file into the container** (`exp.docker.mount-real-config`). Symptom: After the container starts, it treats config.yaml as a directory and exits. Action: First place a config.yaml copied from the example on the host, then mount it into the container as a file. Do not mount a path that does not exist yet. Source issues: [#32](https://github.com/router-for-me/CLIProxyAPI/issues/32)、[#2009](https://github.com/router-for-me/CLIProxyAPI/issues/2009)、[#2450](https://github.com/router-for-me/CLIProxyAPI/issues/2450)、[#2682](https://github.com/router-for-me/CLIProxyAPI/issues/2682)、[#2950](https://github.com/router-for-me/CLIProxyAPI/issues/2950)。. Official pages: [Command-line flags](/introduction/install)、[Run with Docker Compose](/docker/docker).
- <a id="exp-docker-prepare-auth-dir"></a>**Prepare the configuration and credential directories before startup** (`exp.docker.prepare-auth-dir`). Symptom: Compose cannot start because a directory does not exist or the configuration has no auth-dir. Action: Before startup, create the configuration directory and credential directory to be mounted, and set oauth.auth-dir in config.yaml. Source issues: [#305](https://github.com/router-for-me/CLIProxyAPI/issues/305)、[#3272](https://github.com/router-for-me/CLIProxyAPI/issues/3272)。. Official pages: [Run with Docker Compose](/docker/docker)、[OAuth directory, aliases, and exclusions](/accounts/oauth).
- <a id="exp-docker-same-storage-backends"></a>**The container keeps using the existing storage methods** (`exp.docker.same-storage-backends`). Symptom: On a platform such as Zeabur, it seems another set of storage switches is required. Action: The container still uses the already supported local directory, Git, database, or object storage. Do not look for a platform-specific storage key. Source issues: [#403](https://github.com/router-for-me/CLIProxyAPI/issues/403)。. Official pages: [Run with Docker Compose](/docker/docker).

## Standalone pages

This area has no practice that needs its own page.

