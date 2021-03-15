function uploadImgs(imgs) {
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

export default uploadImgs