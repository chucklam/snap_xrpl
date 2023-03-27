# Metamask Snap to support XRP
This repo holds a prototype Metamask Snap to support XRPL. It's a monorepo with two packages in directories `site` and `snap`. The `snap` directory holds the code for the Snap itself, while `site` is a Gatsby / React app that interacts with the Snap to demo getting a user's XRP account and balance.

## Development
This repo used the [@metamask/template-snap-monorepo](https://github.com/MetaMask/template-snap-monorepo) template as its starting point. Refer to their README for info not included here. Metamask has [documentations]() for understanding and developing Snaps.

For local development, you'll need `yarn` and `nodejs` installed. You'll also need to install all the dependencies after cloning the repo:

```shell
yarn install
```

To run locally, execute:

```shell
yarn start
```

You can now go to http://localhost:8000 to access the dApp that would exercise the XRP Snap.
