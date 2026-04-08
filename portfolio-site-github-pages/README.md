# portfolio-site

苹果官网风格的电商作品集静态站，可直接部署到 GitHub Pages。

## 文件说明

- `index.html`：首页
- `styles.css`：样式文件
- `script.js`：滚动淡入动画
- `CNAME`：GitHub Pages 自定义域名配置（已写入 `1231.de5.net`）

## GitHub Pages 发布步骤

1. 把这些文件上传到仓库根目录
2. 打开仓库 Settings → Pages
3. Source 选择 `Deploy from a branch`
4. Branch 选择 `main`，文件夹选择 `/root`
5. 保存后等待 Pages 发布

## 域名配置

在域名服务商后台添加 CNAME：

- Host / Name: `1231`
- Target / Value: `uncle128.github.io`

## 后续建议

你可以把页面里的 `Your Name Studio`、邮箱、案例标题和描述替换成自己的真实信息。
