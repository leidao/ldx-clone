
//判断参数是否为对象
function isPlainObject(data){
  return Object.prototype.toString.call(data) === '[object Object]'
}

export {
  isPlainObject
}
