# D3.js charts + Webpack Dev Server

## Dependencies

* [Webpack v4](https://webpack.js.org/)
* [dev-server](https://github.com/webpack/webpack-dev-server)
* [HtmlWebPackPlugin](https://github.com/jantimon/html-webpack-plugin)
* [MiniCssExtractPlugin](https://github.com/webpack-contrib/mini-css-extract-plugin)
* [Babel Compiler](http://babeljs.io/)

* [d3.js v5](https://github.com/d3/d3/blob/master/API.md)

## Initialize project

```
npm install
```
Installs `dev` e `prod` dependencies listed in `package.json`

## Start live server

```
npm run start
```
Runs `localhost:(port)` on `--mode dev`

## Build project

```
npm run build
```
Creates `index.html`, `bundle.js`, and `[name].css` files on `--mode prod`
