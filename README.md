# ldx-clone
惰性深克隆，高性能的js克隆

## 传统的深拷贝做法
- JSON.parse(JSON.stringify(data)) 
- 递归浅拷贝 

第一种做法存在一些局限，很多情况下并不能使用，因此这里就不提了；第二种做法一般是工具库中的深拷贝函数实现方式，比如 loadash 中的 cloneDeep。虽然这种做法能解决第一种做法的局限，但是对于庞大的数据来说性能并不好，因为需要把整个对象都遍历一遍。 

## 使用`proxy`进行惰性深拷贝
- 其实 Immer 这个库就是用了这种做法来生成不可变对象的，接下来就让我们来试着通过 Proxy 来实现高性能版的深拷贝。 
- 思路: 
    1.拦截 set，所有赋值都在 copy （原数据浅拷贝的对象）中进行，这样就不会影响到原对象。<br/>    
    2.拦截 get，通过属性是否修改的逻辑分别从 copy 或者原数据中取值。<br/>       
    3.最后生成不可变对象的时候遍历原对象，判断属性是否被修改过，也就是判断是否存在 copy。如果没有修改过的话，就
      返回原属性，并且也不再需要对子属性对象遍历，提高了性能。如果修改过的话，就需要把 copy 赋值到新对象上，并且递归遍历。<br/>       
 
## 使用
```javascript
  // npm下载
  npm install ldx-clone --save
  // esModule导入
  import { produce } from 'ldx-clone'
  // 拷贝对象
  const state = {
    info: {
      name: "yck",
      career: {
        first: {
          name: "111",
        },
      },
    },
    data: [1],
  };
  // 调用函数进行拷贝并传入回调在初始时修改对象数据
  const data = produce(state, (draftState) => {
    draftState.info.age = 26;
    draftState.info.career.first.name = "222";
  });
  console.log("data", data,state);
```