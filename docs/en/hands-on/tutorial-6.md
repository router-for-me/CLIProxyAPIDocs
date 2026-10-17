---
title: "Six: The Beginner's Favorite GUI"
translation_pending: false
---

# Six: The Beginner's Favorite GUI

Connect to an existing management interface or terminal interface with the management key. The interface itself stays on its own page. It is not rewritten here.

## Scenario

The proxy is already running through [Run with Docker Compose](/docker/docker) or the local binary. You want to open the management panel, the desktop client, or the terminal interface.

## Steps

1. First make the management routes register: set the management key, and decide whether non-local access is allowed and whether the control panel is served. All of that is in [Management settings](/operations/management-settings). Use `YOUR_API_KEY` for the key.
2. Which repository the panel is downloaded from, and when it updates, is also only on that same page. Page operations are in [Web UI](/management/webui). Do not copy button descriptions back to this page.
3. Installing the desktop client and connecting accounts are in [Desktop client](/management/gui). This page does not repeat its OAuth or API connection steps.
4. If you would rather stay in the terminal, see [Terminal interface](/operations/tui). The remote management address still follows the management settings.
5. After you are connected, configuration changes go through [Management API v8](/management/apiv8), credentials go through [Management credentials](/management/v8-credentials), and OAuth sessions go through [Management OAuth](/management/v8-oauth).
6. `/v0/management` is no longer maintained. Do not call it from an old tutorial. See [Management API](/management/api).

## What not to finish on this page

Do not write management request examples here, and do not turn the panel repository address into a tutorial-specific value.
