const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use('/thaieasy/pro/apiapp', proxy({
        target: 'https://xhm.xiaohemu.net/thaieasy/pro/apiapp',
        changeOrigin: true,
        // 重写接口路由
        pathRewrite: {
            '^/thaieasy/pro/apiapp': '' // 这样处理后，最终得到的接口路径为： http://localhost:8080/xxx
        }
    }));
};