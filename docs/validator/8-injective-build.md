---
description: How to Install mev-tendermint on Injective
title: Install on Injective
sidebar_position: 8
---

# Install on Injective

Injective is not open source, so we provide a compiled binary with mev-tendermint.

Set a version tag based on whether you're using testnet or mainnet:

- Mainnet (`injective-1`): `export VERSION_TAG=1.10.0`
- Testnet (`injective-888`): `export VERSION_TAG=1.10.2`

Download the tarball:

```bash
wget https://injective-mev.s3.us-east-2.amazonaws.com/injective-mev-v"${VERSION_TAG}".tar.gz
```

Extract the contents of the tarball:

```bash
tar -xf injective-mev-v1.10.0.tar.gz
```

Move `libwasmvm.x86_64.so` to a directory in your `$LD_LIBRARY_PATH` (e.g. `/usr/lib`)

Move `injectived` to `$HOME` directory (The normal location where your injective binary lives)
