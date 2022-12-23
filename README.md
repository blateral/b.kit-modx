![b.kit logo](./public/Kit_Logo.svg)

# b.kit MODX

This package provides an interface to connect b.kit components with the MODX CMS. To do so it defines slices that can be imported and used inside e.g. in a react nextjs project.

Our ModxCloud is based on **ContentBlocks** that create JSON-Data that then is consumed by our kit-server template, sliced into perfect data then used to render components from b.kit. We use a lot of **Snippets** to adjust data in the CMS so we have to slice less. Additionally, we use **Chunks** to capsule data.

How a Page is structured is typically set in **Templates**. Those **Templates** use **Chunks** and **Snippets** to form and structure the JSON data.

## Local Testing

The bundled package can be tested locally with a npm package called [Yalc](https://github.com/wclr/yalc). `Yalc` acts as very simple local repository for locally developed packages to share them across a local environment.

### Workflow

Install yalc globally: `yarn global add yalc`.

**Inside the library/package repository:**

1. Run `yarn build` to bundle the package.
2. Run `yalc push` to push it to local global store (~/.yalc).

**Inside a repository that consumes the package:**

1. To link local package run `yalc add <repository-name>` (e.g. yalc add @blateral/b.kit).
2. Before committing to remote repository remove the local package links by running `yalc remove <repository-name>` or `yalc remove --all`.
3. Use `yarn --check-files` to savely install the remote packages defined in package.json. In some repositories there is also a script `yarn lookup` that does the same.
