// 用一个全局变量存储被注册的副作用函数
let activeEffect
// effect 函数用于注册副作用函数
function effect(fn) {
    const effectFn = () => {
        activeEffect = effectFn
        fn()
    }
    effectFn.deps = []
    effectFn()
}
// 存储副作用函数的桶
const bucket = new WeakMap()
// 原始数据
const data = { text: 'hello world' } // 对原始数据的代理
const obj = new Proxy(data, {
    // 拦截读取操作 
    get(target, key) {
        track(target, key)
        // 返回属性值
        return target[key]
    },
    // 拦截设置操作
    set(target, key, newVal) {
        // 设置属性值
        target[key] = newVal
        trigger(target, key)
    }
})
// ----------------------------------------------------------------

function track(target, key) {
    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    } if (!activeEffect) return
    // 最后将当前激活的副作用函数添加到“桶”里
    deps.add(activeEffect)
}

function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)
    // 把副作用函数从桶里取出并执行 
    effects && effects.forEach(fn => fn())
}
// --------------------------------------------------------------

effect(
    () => {
        // console.log('effect run')
        document.body.innerText = obj.text
    }
)

obj.text = 111

