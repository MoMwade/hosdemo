import React, { useState, useCallback, useContext } from "react";
//引入
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import {
  LockOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import Captcha from "react-captcha-code";
import { useNavigate } from "react-router-dom";
import { login, getRouters } from "../service/index";
import { RoutesContext } from "@/routes";
import dynamicRoutes from "@/routes/routes.dynamic"
//组件的最外层
const particlesInit = async (main) => {
  await loadFull(main);
};

export default function Login() {
  let [show, setShow] = useState(true);
  let [handle, setHandle] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [,setRoutesData] = useContext(RoutesContext)
  const navigate = useNavigate();

  const info = () => {
    messageApi.info("验证码错误");
  };
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    if (handle === values.yanzhen) {
      login({ username: values.username, password: values.password }).then(
        (res) => {
          if(res.data.data){
            localStorage.token = res.data.data
            getRouters().then((res) => {
              localStorage.setItem("routers",JSON.stringify(res.data.data))
              setRoutesData(dynamicRoutes())
              navigate("/system/user");
            })
          }
        }
      );
    } else {
      info();
    }
  };
  const onChange = (e) => {
    setShow(e.target.checked);
  };
  const handleClick = useCallback((captcha) => {
    setHandle(captcha);
  }, []);
  //粒子参数

  const options = {
    background: {
      image: "url('https://pe.xzzl120.com/admin/static/img/bg.3d9a89e4.jpg')",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover",
    },
    // 帧数，越低越卡,默认60
    fpsLimit: 120,
    fullScreen: {
      zIndex: 1,
    },
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onhover: {
          enable: true,
          mode: "grab",
        },
      },
      modes: {
        push: {
          //点击是添加1个粒子
          quantity: 5,
        },
        bubble: {
          distance: 200,
          duration: 2,
          opacity: 0.8,
          size: 20,
          divs: {
            distance: 200,
            duration: 0.4,
            mix: false,
            selectors: [],
          },
        },
        grab: {
          distance: 400,
        },
        //击退
        repulse: {
          divs: {
            //鼠标移动时排斥粒子的距离
            distance: 200,
            //翻译是持续时间
            duration: 0.4,
            factor: 100,
            speed: 1,
            maxSpeed: 50,
            easing: "ease-out-quad",
            selectors: [],
          },
        },
        //缓慢移动
        slow: {
          //移动速度
          factor: 2,
          //影响范围
          radius: 200,
        },
        //吸引
        attract: {
          distance: 200,
          duration: 0.4,
          easing: "ease-out-quad",
          factor: 3,
          maxSpeed: 50,
          speed: 1,
        },
      },
    },
    //  粒子的参数
    particles: {
      //粒子的颜色
      color: {
        value: "#ffffff",
      },
      //是否启动粒子碰撞
      collisions: {
        enable: true,
      },
      //粒子之间的线的参数
      links: {
        color: {
          value: "#ffffff",
        },
        distance: 150,
        enable: true,
        warp: true,
      },
      move: {
        attract: {
          rotate: {
            x: 600,
            y: 1200,
          },
        },
        enable: true,
        outModes: {
          bottom: "out",
          left: "out",
          right: "out",
          top: "out",
        },
        speed: 2,
        warp: true,
      },
      number: {
        density: {
          enable: true,
          value_area: 700,
        },
        //初始粒子数
        value: 90,
      },
      //透明度
      opacity: {
        value: 0.5,
        animation: {
          speed: 3,
          minimumValue: 0.1,
        },
      },
      //大小
      size: {
        random: {
          enable: true,
        },
        value: {
          min: 1,
          max: 3,
        },
        animation: {
          speed: 20,
          minimumValue: 0.1,
        },
      },
    },
    line_linked: {
      enable: true,
      distance: 300,
    },
    move: {
      attract: {
        rotateX: 300,
        rotateY: 100,
      },
    },
  };

  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      {contextHolder}
      <Particles init={particlesInit} options={options} />
      <div className="bg-white rounded-lg w-[300px] h-[333px] p-[25px] pb-[5px] z-[100]  fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <h1 className=" font-bold m-auto mb-[20px] text-center text-[#707070] text-[20px]">
          {" "}
          西藏阜康肿瘤医院 管理系统
        </h1>
        <Form
          name="normal_login"
          className="login-form text-[16px]"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: "请输入您的账号",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="账号"
            />
          </Form.Item>
          <Form.Item
            name="password"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: "请输入您的密码",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="current-password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item
            name="yanzhen"
            rules={[
              {
                required: true,
                message: "请输入您的密码",
              },
            ]}
            className="mb-[20px]"
          >
            <div className="flex justify-between items-center">
              <Input
                prefix={
                  <SafetyCertificateOutlined className="site-form-item-icon" />
                }
                type="text"
                placeholder="验证码"
                className="w-[60%]"
              />
              <Captcha
                charNum={4}
                onChange={handleClick}
                height={30}
                width={80}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            className="mb-[0px]"
          >
            <Checkbox
              onChange={onChange}
              style={{ color: show ? "blue" : "" }}
              className="mb-[0px]"
            >
              记住密码
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button w-[100%] bg-blue-400"
            >
              登入
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
