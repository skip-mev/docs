---
description: Methods for automatically installing mev-tendermint
title: Automatically Install mev-tendermint
sidebar_position: 4
---

# Methods for Automatically Installing `mev-tendermint`

This page describes several ways to automatically install mev-tendermint in chain nodes, which may be convenient for validators who don’t want to patch mev-tendermint into their go.mod file themselves. 

_Please let us know on TG, Discord, or email if you find any of these services helpful. 
We may deprecate these if we don't receive feedback._

### Source code referencing mev-tendermint 

We maintain forks of the source code for all the open source chains we support, where we’ve already replaced `tendermint` with `mev-tendermint`: 

- **EVMOS:** [github.com/skip-mev/evmos](http://github.com/skip-mev/evmos)
- **JUNO:** [github.com/skip-mev/juno](http://github.com/skip-mev/juno)
- **Terra2:** [github.com/skip-mev/terra-core](http://github.com/skip-mev/terra-core)

For each version of the chain we support, we provide a tag/release that incorporates the latest, correct mev-tendermint version with the naming convention: `$CHAIN_VERSION-mev`.

  - For example, [the `v11.0.3-mev` tag](https://github.com/skip-mev/juno/releases/tag/v11.0.3-mev) in [github.com/skip-mev/juno](http://github.com/skip-mev/juno)  consists of `v11.0.3` of the JUNO source code with `tendermint@v0.34.21` replaced with `mev-tendermint@v0.34.21-mev.14` in the `go.mod` 

Just clone the repo, checkout the appropriate `mev` tag using `git checkout` (e.g. `git checkout v11.0.3-mev` ) and make install as normal.


### Container Images built with `mev-tendermint`

We provide container images that have been pre-built with the latest, correct version of mev-tendermint for all the chains we support: 

- [EVMOS](https://github.com/orgs/skip-mev/packages/container/package/evmos): `ghcr.io/skip-mev/evmos`
- [JUNO](https://github.com/orgs/skip-mev/packages/container/package/juno): `ghcr.io/skip-mev/juno`
- [Terra2](https://github.com/orgs/skip-mev/packages/container/package/terra-core): `ghcr.io/skip-mev/terra-core`

For each version of the chain we support, we offer a corresponding docker image with the tag naming convention: `$CHAIN_VERSION-mev` 

→ For example, `[ghcr.io/skip-mev/juno:v11.0.3-mev](http://ghcr.io/skip-mev/juno:v11.0.3-mev)` consists of JUNO`v11.0.3` built using the Dockerfile provided by core JUNO team, modified to use with `mev-tendermint@0.34.21-mev.14` 

### Ansible Playbooks Provided by [Tessellated](https://tessellatedgeometry.com/)

[Tessellated/Skip-Playbooks](https://github.com/Tessellated-io/skip-playbooks) provides Ansible Playbooks that enter a target host, clone the node source code, patch the appropriate version of mev-tendermint into the code base, make the necessary config modifications, and clean up after themselves. 

We work closely with Tessellated to ensure the playbooks are up-to-date and effective.