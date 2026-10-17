---
title: LAN discovery
feature_ids:
  - server.discovery.advertise-management
  - server.discovery.auth-required
  - server.discovery.enabled
  - server.discovery.interfaces-exclude
  - server.discovery.interfaces-include
  - server.discovery.service-name
  - server.discovery.service-type
  - server.discovery.subtypes
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# LAN discovery

## 1. What this solves

Advertise this instance on the local network with mDNS / DNS-SD, so clients on the same LAN can discover the gateway address, whether authentication is required, and whether the advertisement says the management API is available.

## 2. Scope and non-goals

It advertises only when `server.discovery.enabled` is true. It does not replace a client key, and it does not open remote management. Docker's default bridge does not pass the link-local multicast `224.0.0.251`. To advertise on a physical LAN, the container needs host networking. The listen address is in [Listener and process](/operations/server).

## 3. How to configure or call it

In the sample configuration, discovery is off by default. The other entries are shown as comments:

```yaml
server:
  discovery:
    enabled: false
    # service-name: ""
    # service-type: "_ai-gateway._tcp"
    # subtypes:
    #   - "_chat-completions"
    #   - "_responses"
    #   - "_messages"
    #   - "_generate-content"
    #   - "_interactions"
    # interfaces:
    #   include: []
    #   exclude: []
    # auth-required: true
    # advertise-management: false
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| server.discovery.advertise-management | Whether the advertisement says the management API is available. | AdvertiseManagement explicitly controls whether management endpoints are exposed (default: false). | It only affects the TXT record. It does not register management routes because of that. |
| server.discovery.auth-required | Tell clients whether a call requires authentication. | AuthRequired indicates whether authentication is required for client calls (default: true). | When omitted, the advertisement uses true. An explicit false is written into TXT. It does not change the API's own authentication middleware. |
| server.discovery.enabled | Whether to advertise with mDNS on the local network. | Enabled toggles mDNS service advertising on the local network (default: false). | When false, there is no advertisement. |
| server.discovery.interfaces.exclude | Extra interface match patterns to exclude. | nil | Filtered together with include. If no qualified physical interface remains, advertising is refused. It does not fall back to every interface. |
| server.discovery.interfaces.include | Interface allowlist. | nil | An empty list auto-detects physical interfaces. |
| server.discovery.service-name | Optional instance-name prefix. | When empty, defaults to CPA-&lt;ShortID&gt;. | An empty name is advertised as `CPA-&lt;ShortID&gt;`. A custom name is advertised as `&lt;name&gt;-&lt;ShortID&gt;`. |
| server.discovery.service-type | DNS-SD service type. | ServiceType is the DNS-SD service type (default: _ai-gateway._tcp). | An empty value uses `_ai-gateway._tcp`. A non-empty value must match the service-type format, or building the discovery spec fails. |
| server.discovery.subtypes | API protocol subtypes to advertise. | nil | When omitted or the list is empty, the subtypes are `_chat-completions`, `_responses`, `_messages`, `_generate-content`, and `_interactions`. If none remain after cleanup, only `_chat-completions` is kept. |

## 5. Common errors and limits

If the bind address is `localhost` or another loopback address, LAN advertising is refused. A bind address that is not an IP is also refused. If the port is not from 1 to 65535, the discovery spec is invalid. If there is no qualified physical interface, or no interface owns that bind address, there is no advertisement. An illegal `service-type` format fails. These failures do not mean the HTTP port failed to come up.

## 6. Related behavior

The bind host is in [Listener and process](/operations/server). The HTTPS mark comes from [TLS](/operations/tls). Whether the management API can actually be called is in [Management settings](/operations/management-settings).

## 7. Field experience

None yet.
