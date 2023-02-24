---
description: How to Install mev-tendermint on Injective
title: Install on Injective
sidebar_position: 8
---

# Install on Injective

Injective is not open source, so we provide a compiled binary with mev-tendermint:

Download the tarball:

```bash
wget https://injective-mev.s3.us-east-2.amazonaws.com/injective-mev-v1.9.0.tar.gz
```

Extract the contents of the tarball:

```bash
tar -xf injective-mev-v1.9.0.tar.gz
```

Move `libwasmvm.x86_64.so` to a directory in your `$LD_LIBRARY_PATH` (e.g. `/usr/lib`)

Move `injectived` to `$HOME` directory (The normal location where your injective binary lives)
