const MY_IMMER = 'MY_IMMER'
// 存放生成的 proxy 对象
const proxies = new Map()
// 存放修改前的浅拷贝数据，因为引用关系，修改会同步
const copies = new Map()

import {isPlainObject} from '../utils/index'
// 用于判断是否为 proxy 对象
const isProxy = value => !!value && !!value[MY_IMMER]

// 用于判断数据是否被修改或者读取过
const isChange = data => {
  if (proxies.has(data) || copies.has(data)) return true
}

// 获取proxy对象
const getProxy = data => {
  // 如果为proxy对象，直接返回。
  if (isProxy(data)) {
    return data
  }
  if (isPlainObject(data) || Array.isArray(data)) {
    if (proxies.has(data)) {
      return proxies.get(data)
    }
    // 把数据进行proxy代理
    const proxy = new Proxy(data, objectTraps)
    proxies.set(data, proxy)
    return proxy
  }
  return data
}

const objectTraps = {
  get(target, key) {
    if (key === MY_IMMER) return target
    const data = copies.get(target) || target
    return getProxy(data[key])
  },
  set(target, key, val) {
    const copy = getCopy(target)
    const newValue = getProxy(val)
    // 这里的判断用于拿 proxy 的 target
    // 否则直接 copy[key] = newValue 的话外部拿到的对象是个 proxy
    copy[key] = isProxy(newValue) ? newValue[MY_IMMER] : newValue
    return true
  }
}
// 如果修改值，先将需要修改的数据浅拷贝，存入map对象中，在return出来
const getCopy = data => {
  // 初次修改后，finalize函数调用时会拿取修改后的浅拷贝数据
  if (copies.has(data)) {
    return copies.get(data)
  }
  // 浅拷贝
  const copy = Array.isArray(data) ? data.slice() : { ...data }
  copies.set(data, copy)
  return copy
}

const finalize = data => {
  if (isPlainObject(data) || Array.isArray(data)) {
    if (!isChange(data)) {
      return data
    }
    const copy = getCopy(data)
    console.log('========',Object.keys(copy));
    Object.keys(copy).forEach(key => {
      // console.log('finalize(copy[key])',copy[key]);
      
      copy[key] = finalize(copy[key])
    })
    return copy
  }
  return data
}

export function produce(baseState, fn) {
  const proxy = getProxy(baseState)
  fn && fn(proxy)
  return finalize(baseState)
}


