import store from '@/store';
import { actionGetOssConfig } from '@/store/actionCreator';
import { ossuploadimgapi } from '@/api/baseapi';


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

// 获取随机数
function random_string(len) {
    len = len || 32
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    var maxPos = chars.length
    var pwd = ''
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
}

// 同步上传图片
export async function uploadImgsAsync(imgs) {

    let ossConfig = store.getState().ossConfig
    // 如果ossConfig为空或者ossConfig的时间过期则重新开始请求oss配置数据
    if (!ossConfig || true) {

        await store.dispatch(actionGetOssConfig()).then(ossConfigData => {
            // 获取成功
            console.log(`获取oss配置信息成功:${JSON.stringify(ossConfigData)}`)
            ossConfig = store.getState().ossConfig
        }).catch(error => {
            // 获取失败
            console.log(error.msg)
        })
    }
    console.log(`当前即将上传的图片信息为`)
    console.log(imgs)

    // 开始使用PostObject方式上传
    let imgsArr = []
    // 遍历每一张图片进行上传
    for (var i = 0; i < imgs.length; i++) {
        let imgFile = imgs[i].file
        let imgExt = imgFile.type.indexOf('png') > 0 ? 'png' : 'jpg'
        // 文件路径+名称
        let fileName = ossConfig.dir + ossConfig.fileprefix + '_' + random_string() + '.' + imgExt
        // 
        let formData = new FormData()
        formData.append('key', fileName)
        formData.append('name', imgFile.name)
        formData.append('policy', ossConfig.policy)
        formData.append('OSSAccessKeyId', ossConfig.accessid)
        formData.append('success_action_status', '200')
        formData.append('signature', ossConfig.signature)
        formData.append('filename', fileName)
        formData.append('file', imgFile) // 文件或文件内容必须是表单最后一个域

        // 使用axios进行Post上传文件
        let requestConfig = {
            baseUrl: '',
            url: ossConfig.host,
            data: formData,
            params: {
                requestType: 'uploadossfile' // 设置上传标识
            },
            header: { 'Content-Type': 'multipart/form-data' }
        }
        await ossuploadimgapi(requestConfig).then(response => {
            if (response.status === 200) {
                console.log(`上传成功`)
                console.log(fileName)
                imgsArr.push(fileName)
            }

        }).catch(error => {
            console.log(`上传失败`)
        })
    }

    console.log(`所有图片上传完毕,返回的图片数组为:`)
    console.log(imgsArr)

    return imgsArr



    // browser.js上传方式
    // let OSS = require('ali-oss')
    // // 初始化oss
    // let client = new OSS({
    //     region: '<oss region>',
    //     //阿里云账号AccessKey拥有所有API的访问权限，建议遵循阿里云安全最佳实践，创建并使用STS方式访问API。
    //     accessKeyId: '<Your accessKeyId(STS)>',
    //     accessKeySecret: '<Your accessKeySecret(STS)>',
    //     stsToken: '<Your securityToken(STS)>',
    //     bucket: '<Your bucketName>'
    // });
    // console.log(client)


    // try {
    //     imgs.forEach(eachimg => {
    //         client.put()
    //     })
    // } catch (error) {

    // }
}