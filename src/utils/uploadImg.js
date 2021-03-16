import store from '@/store';
import { actionGetOssConfig, actionLogout } from '@/store/actionCreator';


export function uploadImgs(imgs) {
    let allPromiseArr = []
    imgs.forEach((eachimg, index) => {
        let uploadpromise = new Promise((resolve, reject) => {
            resolve(`图片-${index}上传成功`)
        })
        allPromiseArr.push(uploadpromise)
    });

    let allPromise = Promise.all(allPromiseArr)
    return allPromise
}

// 同步上传图片
export async function uploadImgsAsync(imgs) {

    let ossConfig = store.getState().ossConfig
    // 如果ossConfig为空或者ossConfig的时间过期则重新开始请求oss配置数据
    if (!ossConfig) {

        store.dispatch(actionGetOssConfig()).then(ossConfigData => {
            // 获取成功
            console.log(`获取oss配置信息成功:${JSON.stringify(ossConfigData)}`)
            ossConfig = store.getState().ossConfig
        }).catch(error => {
            // 获取失败
            console.log(error.msg)
        })
    }
    return

    let OSS = require('ali-oss')
    // 初始化oss
    let client = new OSS({
        region: '<oss region>',
        //阿里云账号AccessKey拥有所有API的访问权限，建议遵循阿里云安全最佳实践，创建并使用STS方式访问API。
        accessKeyId: '<Your accessKeyId(STS)>',
        accessKeySecret: '<Your accessKeySecret(STS)>',
        stsToken: '<Your securityToken(STS)>',
        bucket: '<Your bucketName>'
    });
    console.log(client)


    // try {
    //     imgs.forEach(eachimg => {
    //         client.put()
    //     })
    // } catch (error) {

    // }
}