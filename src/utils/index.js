export default class utils {

    // 全局显示toast框
    static showToast = (msg, type = 'info') => {
        console.error('全局toast显示错误', msg, type);
    }

    // 全局显示dialog提示框  type: normal/confirm  callBack 点击确定/取消之后的函数回调
    static showDialog = (title, content, type = 'normal', callBack) => {
        console.error('全局dialog显示错误', title, content, type, callBack)
    }


    // 节流函数
    static throttle = (fn, delay) => {
        let timer = null
        return function () {
            let that = this
            let args = arguments
            if (!timer) {
                timer = setTimeout(() => {
                    fn.apply(that, args)
                    timer = null
                }, delay);
            }
        }
    }

}