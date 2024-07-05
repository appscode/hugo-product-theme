# Install AppsCode Product Theme

>Verify that you have installed Hugo v0.112.0 or later.
```sh
hugo version
```
Run these commands to create a Hugo site with the [hugo-product-theme](https://github.com/appscode/hugo-product-theme) theme.

```sh
hugo new site hugo-product-demo
cd hugo-product-demo
git init
git submodule add git@github.com:appscode/hugo-product-theme.git themes/hugo-product-theme
```

Replace hugo.toml file to [config.yaml](https://github.com/appscode/hugo-product-demo/blob/master/config.yaml) and update necessary data

Then, Add [Makefile](https://github.com/appscode/hugo-product-demo/blob/master/Makefile), [data/config.json](https://github.com/appscode/hugo-product-demo/blob/master/data/config.json) in root directory

In `static` directory add `assets` folder

Then, Run this command
```sh
make assets
```
After successfully run this command, please install `postcss-cli`
```sh
npm install postcss-cli
```
Run hugo server,
```sh
hugo server
```

If you want demo content, please download those content also [content](https://github.com/appscode/hugo-product-demo/tree/master/content)

View your site at the URL displayed in your terminal. Press Ctrl + C to stop Hugo’s development server.
