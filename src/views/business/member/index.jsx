import { useState, memo, useRef, useEffect } from "react";
import { Select, DatePicker, Button, Modal, Form, Input, Upload, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, VerticalAlignBottomOutlined, LoadingOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from "uuid"
import axios from "axios";
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import 'moment/dist/locale/zh-cn';
import CommonHeader from "@/components/CommonHeader";
import CommonStatusbar from "@/components/CommonStatusbar";
import TextBox from "@/components/TextBox";
import useUserStore from '@/store/user';
import FormDate from '@/hooks/useFormDate';
import { getBusinessMemberAdd, getMemberList } from "@/service";


const Member = memo(
  function() {
    const { RangePicker } = DatePicker;
    const UserStore = useUserStore();
    const [Area, setArea] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userName, setUserName] = useState();
    const [nickName, setNickName] = useState();
    const [fullName, setFullName] = useState();
    const [region, setRegion] = useState();
    const [gender, setGender] = useState();
    const [openId, setOpenId] = useState();
    const [unionId, setUnionId] = useState();
    const [avatarUrl, setAvatarUrl] = useState();
    const [loading, setLoading] = useState(false);
    const [registerType, setRegisterType] = useState();
    const [remark, setRemark] = useState();
    const node = useRef(null);
    const optionArea = [
      { label: '拉萨市', value: '540000' },
      { label: '日喀则市', value: '540100' },
      { label: '昌都市', value: '540300' },
      { label: '林芝市', value: '540400' },
      { label: '山南市', value: '540500' },
      { label: '那曲市', value: '540600' },
      { label: '阿里地区', value: '542500' },
    ];
    const optionRegion = [
      { label: '男', value: 1 },
      { label: '女', value: 0 },
    ]
    const optionRegisterType = [
      { label: '手机号', value: 1 },
      { label: '邮箱', value: 2 },
      { label: '微信公众号', value: 3 },
    ]

    const MemberAdd = async () => {
      const res = await getBusinessMemberAdd({
        // userId: 0,
        userName:"wy",
        nickname:"iie",
        headimgurl:"1eee",
        regtype:"1",
        openid:"12345",
        unionid:"1467673",
        remark: "uhg",
        name:"额外i的",
        sex:"1",
        region:"",
      })
      console.log(res);
    }
    const handle = () => {
      setIsModalOpen(false);
    };
    const beforeUpload = (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    };
    const handleChange = (info) => {
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }
      if (info.file.status === 'done') {
        const form = FormDate({
          key: uuidv4(),
          file: info.file.originFileObj,
          token: UserStore.user.token.uploadToken
        })
        axios.post("https://upload-z2.qiniup.com",form).then(res => {
          setAvatarUrl(`${UserStore.user.token.baseURL}${res.data.key}`)
        })
      }
    };
    const validate = () => {
      node.current.validateFields().then(()=>{
        MemberAdd()
      })
    }
    const uploadButton = (
      <button
        style={{
          border: 0,
          background: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: 'none',
          padding: 0,
          height: '100%',
          width: '100%',
        }}
        type="button"
      >
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div
            style={{
              marginTop: 8,
            }}
          >
            Upload
          </div>
        </div>
      </button>
    );

    useEffect(()=> {
      getMemberList().then(res => {
        console.log(res);
      })
      UserStore.getRequestToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
      <div>
        <CommonHeader
          theme="手机"
          className=" max-w-[1200px] mb-[15px]"
          BoxClass ="min-w-[1200px] flex justify-between"
        >
          <TextBox label="昵称"></TextBox>
          <TextBox label="地区">
            <Select
              placeholder="请选择"
              value={Area}
              options={optionArea}
              onChange={(e) => setArea(e)}
              size="large"
              style={{ width: 120 , marginLeft: 30}}
            ></Select>
          </TextBox>
          <TextBox label="注册时间">
            <RangePicker showTime locale={zhCN}  renderExtraFooter={() => '请选择日期'} size="large" />
          </TextBox>
        </CommonHeader>
        <CommonStatusbar>
            <div className="w-[350px] flex justify-between">
              <Button type="primary" icon={<PlusOutlined />} onClick={()=> setIsModalOpen(true)}>新增</Button>
              <Button icon={<EditOutlined />} >修改</Button>
              <Button icon={<DeleteOutlined />}>删除</Button>
              <Button type="primary" danger icon={<VerticalAlignBottomOutlined />}>导出</Button>
            </div>
        </CommonStatusbar>
        <Modal title="添加" open={isModalOpen} onOk={validate} onCancel={handle} okText="确定" cancelText="取消">
          <Form
            name="wrap"
            ref={node}
            labelCol={{
              flex: '110px',
            }}
            labelAlign="left"
            labelWrap
            wrapperCol={{
              flex: 1,
            }}
            colon={false}
            style={{
              maxWidth: 600,
            }}
            onFinish={validate}
          >
            <Form.Item
              label="用户名"
              name="userName"
              rules={[
                {
                  required: true,
                  message:'不能为空'
                },
              ]}
            >
             <Input placeholder="请输入用户名" value={userName} onChange={(e) => setUserName(e.target.value)}></Input>
            </Form.Item>
            <Form.Item
              label="昵称"
              name="nickName"
            >
             <Input placeholder="请输入昵称" value={nickName} onChange={(e) => setNickName(e.target.value)}></Input>
            </Form.Item>
            <Form.Item
              label="姓名"
              name="fullName"
            >
             <Input placeholder="请输入姓名" value={fullName} onChange={(e) => setFullName(e.target.value)}></Input>
            </Form.Item>
            <Form.Item
              label="地区"
              name="region"
            >
             <Input placeholder="请输入地区" value={region} onChange={(e) => setRegion(e.target.value)}></Input>
            </Form.Item>
            <Form.Item
              label="性别"
              name="gender"
            >
             <Select  placeholder="请选择" options={optionRegion} value={gender} onChange={e => setGender(e)} />
            </Form.Item>
            <Form.Item
              label="openid"
              name="openid"
            >
             <Input placeholder="请输入openid" value={openId} onChange={(e) => setOpenId(e.target.value)}></Input>
            </Form.Item>
            <Form.Item
              label="unionid"
              name="unionid"
            >
             <Input placeholder="请输入unionid" value={unionId} onChange={(e) => setUnionId(e.target.value)}></Input>
            </Form.Item>
            <Form.Item
              label="头像"
              name="avatarUrl"
            >
             <div>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  <div className='w-[100%] h-[100%] overflow-hidden'>
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        className='w-[100%] h-[100%] object-cover'
                        alt="avatar"
                        style={{
                          width: '100%',
                        }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </div>
                </Upload>
                <Input placeholder="请上传文件或手动输入文件地址" />
             </div>
            </Form.Item>
            <Form.Item
              label="注册类型"
              name="registerType"
            >
             <Select  placeholder="请选择" options={optionRegisterType} value={registerType} onChange={e => setRegisterType(e)} />
            </Form.Item>
            <Form.Item
              label="备注"
              name="remark"
            >
             <Input placeholder="请输入unionid" value={remark} onChange={(e) => setRemark(e.target.value)}></Input>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
)

export default Member;