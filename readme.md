# MetaTranslator

This is a project help you build userscript with webpack

Just [use this git repo as a template](https://github.com/Trim21/webpack-userscript-template/generate).

## Install

1. Install one of the **Violentmonkey** or **Tampermonkey** extensions (available for all browsers).
2. Go to the [Releases](https://github.com/maanimis/MetaTranslator/releases) section, where you'll find a `.js` file.
3. Click the file to install it, and you're all set!

### How to Use:

- Simply select any text with your mouse, and it will be automatically translated.

## dependencies

There are two ways to using a package on npm.

### UserScript way

like original UserScript way, you will need to add them to your [user script metadata's require section](./config/metadata.cjs#L16-L18) , and exclude them in [config/webpack.config.base.cjs](./config/webpack.config.base.cjs#L18-L20)

### Webpack way

just install packages with npm and import them in your code, webpack will take care them.

## Build

```bash
npm run build
```

`dist/index.prod.user.js` is the final script. you can manually copy it to greasyfork for deploy.

### Minify

There is a [limitation in greasyfork](https://greasyfork.org/en/help/code-rules), your code must not be obfuscated or minified.

If you don't need to deploy your script to greasyfork, enable minify as you like.

## automatically Deploy

[github actions](./.github/workflows/deploy.yaml#L36) will deploy production userscript to gh-pages branch.

[example](https://github.com/Trim21/webpack-userscript-template/tree/gh-pages)

[deployed](https://trim21.github.io/webpack-userscript-template/index.prod.user.js)

You can auto use greasyfork's auto update function.

## Q&A

you may find enabling source map not working well in production code, because Tampermonkey will add extra lines (all your `@require`) before your script. I don't know if there is a good fix for this, You need to use webpack config `devtool` with `eval` prefix to make it work as expected, so source map is disabled in this production build.

<https://webpack.js.org/configuration/devtool/#development>
