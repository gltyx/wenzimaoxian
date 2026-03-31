const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// 代理 CloudBase SDK 请求
app.use('/cloudbase', createProxyMiddleware({
    target: 'https://static.cloudbase.net',
    changeOrigin: true,
    pathRewrite: {
        '^/cloudbase': '/cloudbase-js-sdk/latest'
    }
}));

// 代理 CloudBase API 请求
app.use('/tcb-api', createProxyMiddleware({
    target: 'https://tcb-api.tencentcloudapi.com',
    changeOrigin: true,
    pathRewrite: {
        '^/tcb-api': '/'
    }
}));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Game is available at http://localhost:${PORT}/index.html`);
});
