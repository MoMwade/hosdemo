import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware"; //持久化
import { login } from "@/service";
import axios from "axios";

// create返回值是一个hook函数
const useUserStore = create(
    persist(
        immer(function(setState, getState) {
            // create的回调函数的返回值(对象)是状态
            return{
                user :{
                    name : "张三",
                    age : 30,
                    info: {},
                    token:''
                },
                firstName: "123",
                async setInfoAsync () {
                    const res = await login({
                        username: "admin",
                        password: "1236"
                    });
                    console.log(res);
                    setState(state => state.user.info = res.data)
                },
                setUserAge () {
                    setState(state => {
                        state.user.age++;
                    })
                },
                setUserName (name) {
                    setState(state => {
                        state.user.name = `${getState().firstName}${name}`;
                    })
                },
                async getRequestToken(){
                    const res = await axios.get('http://192.168.68.174:8081/upload/token');
                    setState(state => {
                        state.user.token = res.data.result;
                    })
                }
            }
        }),
        { name: 'user-store' } // 持久化存储的名称
    )
)

export default useUserStore;