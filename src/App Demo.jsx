import React, { memo, useCallback, forwardRef, useMemo, useState } from 'react'
import useUserStore from './store/user';

// 深浅对比
// 默认情况下组件因props变化导致重新渲染的比较方式是 深对比(对比前后的props的引用地址是否一致)(形神一致则不重新渲染)
// 当使用React.memo 包裹一个组件后 该组件props的对比方式 浅对比 
// React.memo可以将props的对比方式由深改浅
// useCallback保持函数的引用非必要不变化
// ref 转发: 函数组件有没有组件实例？

function App() {
  const { user, setUserAge, setUserName } = useUserStore()
  return (
    <>
      <Middle></Middle>
      <h1>{user.name}</h1>
      <h1>{user.age}</h1>
      <button onClick={() => setUserAge()}>修改age</button>
      <button onClick={() => setUserName("王五")}>修改name</button>
    </>
  )
}

const Middle = memo(forwardRef(
  function(props,ref){
    const cb = useCallback(()=>{},[])
    return (
      <>
        <div ref={ref}>{cb}</div>
        <Child></Child>
      </>
    )
  }
))

const Child = function() {
  const [conut,setConut] = useState(0);
  const [num,setNum] = useState(30)
  const fac = useCallback(function fac(num) {
    console.log("阶乘的重新计算...");
    if(num === 1) return 1;
    return num * fac(num-1);
  },[])
  const result = useMemo(()=>fac(num),[num,fac]) 
  const updateCount = setConut(prev => prev + 1);
  const updateNum = setNum(prev => prev + 10);
  return (
    <> 
      <h6>{num}的阶乘：{result}</h6>
      <span>{conut}</span>
      <button onClick={updateCount}>conut</button>
      <button onClick={updateNum}>num</button>
    </>
  )
};

export default App;


/**
 * 深对比
 * let a = {}
 * let b = {}
 * console.log(a === b)
 * 
 * 浅对比
 * let a = {a:1,b:[],c:{}}
 * let b = {a:1,b:[],c:{}}
 * 忽略 a和b 的内存地址
*/

// function deepEqual(a,b) {
//   return a === b;
// }

// function shallowEqual(o1, o2) {
//   const o = Object.keys(o1).length === Object.keys(o2).length ? o1 : null;
//   if(!o) return false;
//   console.log(Object.keys(o).every(key => o1[key] === o2[key]));
//   return Object.keys(o).every(key => o1[key] === o2[key]);
// }

// let a1 = {};
// let a2 = {};
// shallowEqual(a1, a2); // true

// let b1 = { x: 1 };
// let b2 = { x: 2 };
// shallowEqual(b1, b2); // false

// let c1 = { x: 1 };
// let c2 = { x: 1 };
// shallowEqual(c1, c2); // true

// let d1 = { x: 1 };
// let d2 = { x: 1, y: 2 };
// shallowEqual(d1, d2); // false

// let e1 = { x: 1, y: [] };
// let e2 = { x: 1, y: [] };
// shallowEqual(e1, e2); // false

// let y = [];
// let f1 = { x: 1, y };
// let f2 = { x: 1, y };
// shallowEqual(f1, f2); // true


