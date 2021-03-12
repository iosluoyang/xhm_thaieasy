const { override, fixBabelImports, addWebpackAlias } = require('customize-cra')

const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
    webpack: override(
        // 配置antd 的按需引入
        fixBabelImports('import', {
            libraryName: 'antd-mobile',
            style: 'css'
        }),
        // 配置路径访问快捷键 @/xxx
        addWebpackAlias({
            '@': resolve('src'),
        }),
        // postCss 自动将px转为rem 需要配合 lib-flexible 使用
        // addPostcssPlugins([
        //   require('postcss-pxtorem')({ rootValue: 75, propList: ['*'], minPixelValue: 2, selectorBlackList: ['am-'] })
        // ]),
        // 压缩js等
        // addCustomize()
    )
}