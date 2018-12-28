## 说明

该博客用gatsby创建

## 使用

### 使用cli工具
利用[cli工具](https://www.gatsbyjs.org/docs/quick-start)启动

开发:

```
# gatsby develop
```

生成静态页面:

```
# gatsby build
# gatsby serve
```

### 使用npm script

```
"scripts": {
  "dev": "gatsby develop",
  "lint": "eslint --ext .js,.jsx --ignore-pattern public .",
  "test": "echo \"Write tests! -> https://gatsby.app/unit-testing\"",
  "format": "prettier --trailing-comma es5 --no-semi --single-quote --write 'src/**/*.js' 'src/**/*.md'",
  "develop": "gatsby develop",
  "start": "npm run develop",
  "build": "gatsby build",
  "fix-semi": "eslint --quiet --ignore-pattern node_modules --ignore-pattern public --parser babel-eslint --no-eslintrc --rule '{\"semi\": [2, \"never\"], \"no-extra-semi\": [2]}' --fix gatsby-node.js"
}
```

开发：`npm start` 或 `npm run dev`
生成静态页面：`npm run build`
格式化代码：`npm run format`
