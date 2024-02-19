import { useState, useRef, useEffect } from "react";
import { Select, Button, Modal, Form, Input, Upload, message, Table } from "antd";
import { PlusOutlined, MinusOutlined, LoadingOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "axios";
import { v4 as uuidv4 } from "uuid"
import ReactQuill from "react-quill";
import CommonHeader from "@/components/CommonHeader";
import CommonStatusbar from "@/components/CommonStatusbar";
import TextBox from "@/components/TextBox"
import FormDate from '@/hooks/useFormDate';
import useUserStore from '@/store/user';
import { getBusinessDoctorAdd, getDoctorList, getBusinessDoctorDel, getBusinessDoctorEdit } from "@/service";

const Doctor = () => {
  const UserStore = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [department, setDepartment] = useState();
  const [expertName, setExpertName] = useState();
  const [expertTitle, setExpertTitle] = useState();
  const [goodAt, setGoodAt] = useState();
  const [sortId, setSortId] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState();
  const [office, setOffice] = useState();
  const [loading, setLoading] = useState(false);
  const [blurb, setBlurb]  = useState();
  const [doctorCode, setDoctorCode] = useState();
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [doctorEdit, setDoctorEdit] = useState();
  const [doctorEditLoading, setDoctorEditloading] = useState(false);
  const node = useRef(null);
  const optionDepartment = [
    { value: 1, label: '肿瘤内科མཆིན་ནད།' },
    { value: 2, label: '肿瘤外科མཆིན་པའི་ནད།' },
    { value: 3, label: '超声科གློག་ཀླད་རིག་པ།།' },
    { value: 4, label: '放射科རླུང་འཕྲིན།' },
    { value: 5, label: '病理科བརྒྱུད་དབྱིན་པ' },
    { value: 6, label: '检验科བརྒྱུད་དཔྱད་ཞབ།' },
  ]
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ header: [1, 2, false] }],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
      [{ size: ["small", false, "large", "huge"] }],
      [{ color: [] }, { background: [] }]
    ]
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
    },
    {
      title: '专家名称',
      dataIndex: 'expertName',
    },
    {
      title: '职称',
      dataIndex: 'expertTitle',
    },
    {
      title: '医生代码',
      dataIndex: 'doctorCode',
    },
    {
      title: '排序ID',
      dataIndex: 'orderNum',
    },
    {
      title: '头像',
      dataIndex: 'avatarUrl',
      render: (url) => {
        return url
          ? (<img src={url} alt="avatar" style={{ width: '80px', height: '80px' }} />)
          : (<div></div>);
      },
    },
    {
      title: '科室',
      dataIndex: 'department',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div>
            <Button type="link" icon={<EditOutlined  />} onClick={()=> {
              setDoctorEdit(record.key)
              setIsModalOpen(true)
              setDoctorEditloading(true)
            }}>编辑</Button>
            <Button type="link" icon={<DeleteOutlined />} onClick={()=> DoctorDelete(record)} >删除</Button>
        </div>
      ),
    },
  ];

  const deptName = (ArrName) => {
    const filter =  optionDepartment.filter(item => Number(item.value) === Number(ArrName))
      return filter[0]?.label || '其他'
  } 
  const DoctorData = () => {
    setDoctorLoading(true);
    getDoctorList({PageSize:999}).then(res => {
        const Data = res.data.data.result.map(item => {
          return {
            key: item.id,
            expertName: item.doctorName,
            expertTitle: item.title,
            doctorCode: item.doctorCode,
            orderNum: item.orderNum,
            avatarUrl: item.images,
            department: deptName(item.deptid),
          }
        })
        setDoctorList(Data)
        setDoctorLoading(false);
      })
  }
  const DoctorAdd = async () => {
    await getBusinessDoctorAdd({
      doctorName: expertName,
      introduction: blurb,
      title: expertTitle,
      skilled: goodAt,
      images: avatarUrl,
      deptid: office,
      orderNum: sortId,
      doctorCode
    });
  }
  const DoctorEdit = async function(id) {
     await getBusinessDoctorEdit({
      id,
      doctorName: expertName,
      introduction: blurb,
      title: expertTitle,
      skilled: goodAt,
      images: avatarUrl,
      deptid: office,
      orderNum: sortId,
      doctorCode
     })
  }
  const handle = () => {
    setIsModalOpen(false);
    setDoctorEditloading(false);
  };
  const validate = () => {
    node.current.validateFields().then(()=>{
      doctorEditLoading ? DoctorEdit(doctorEdit) : DoctorAdd();
      DoctorData();
      handle()
    })
  }
  const normFile = (e) => {
    if(Array.isArray(e))
    return e;
    return e && e.fileList;
  }
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
      // console.log(token);
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
  const DoctorDelete = function(record) {
    console.log(record.key);
    getBusinessDoctorDel(record.key)
    DoctorData()
  }

  useEffect(() => {
    DoctorData()
    UserStore.getRequestToken()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

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

  return (
      <div>
        <CommonHeader
          theme="专家名称"
          className=" max-w-[1200px]"
          BoxClass ="min-w-[900px] flex justify-between"
        >
          <TextBox label="医生代码"></TextBox>
          <TextBox label="科室">
            <Select
              placeholder="请选择"
              value={department}
              options={optionDepartment}
              onChange={(e) => setDepartment(e)}
              size="large"
              style={{ width: 200 , marginLeft: 30}}
            ></Select>
          </TextBox>
          
        </CommonHeader>
        <CommonStatusbar>
          <Button type="primary" icon={<PlusOutlined />} onClick={()=> setIsModalOpen(true)}>新增</Button>
        </CommonStatusbar>
        <Modal title="添加" width="800px" open={isModalOpen} onOk={validate} onCancel={handle} okText="确定" cancelText="取消">
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
              maxWidth: 700,
            }}
            onFinish={validate}
          >
            <Form.Item
              label="专家名称"
              name="expertName"
              rules={[
                {
                  required: true,
                  message:'不能为空'
                },
              ]}
            >
             <Input placeholder="请输入专家名称" value={expertName} onChange={(e) => setExpertName(e.target.value)}></Input>
            </Form.Item>
            <Form.Item
              label="职称"
              name="title"
            >
             <Input placeholder="请输入职称" value={expertTitle} onChange={(e) => setExpertTitle(e.target.value)}></Input>
            </Form.Item>
            <Form.Item
              label="医生代码"
              name="doctorCode"
            >
             <Input placeholder="请输入职称" value={doctorCode} onChange={(e) => setDoctorCode(e.target.value)}></Input>
            </Form.Item>
            <Form.Item
              label="擅长"
              name="goodAt"
            >
             <Input placeholder="请输入擅长" value={goodAt} onChange={(e) => setGoodAt(e.target.value)}></Input>
            </Form.Item>
            <Form.Item
              label="排序ID"
              name="sortId"
            >
              <div className="flex w-[200px]">
                <Button icon={<MinusOutlined />} onClick={()=> {
                  if(sortId>=1){
                    setSortId(Number(sortId)-1)
                  }
                }}></Button>
                <Input value={sortId} onChange={(e) => setSortId(e.target.value)} className=" text-center" />
                <Button icon={<PlusOutlined />} onClick={()=> setSortId(Number(sortId)+1)}></Button>
              </div>
              
            </Form.Item>
            <Form.Item
              label="头像"
              name="avatarUrl"
              valuePropName='fileList'
              getValueFromEvent={normFile}
            >
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
            </Form.Item>
            <Form.Item
              label="科室"
              name="office"
            >
              <Select
                placeholder="请选择"
                value={office}
                options={optionDepartment}
                onChange={(e) => setOffice(e)}
                size="large"
                style={{ width: 200 }}
              ></Select>
            </Form.Item>
            <Form.Item
              label="简介"
              name="blurb"
              className="h-[300px]"
            >
             <ReactQuill
                className="h-[200px] w-[555px]"
                theme="snow"
                modules={modules}
                value={blurb}
                onChange={(e) => setBlurb(e)}
              ></ReactQuill>
            </Form.Item>
          </Form>
        </Modal>
        <Table 
            columns={columns}
            dataSource={doctorList}
            loading={doctorLoading}
            tableLayout="auto"
            className="mt-[20px]"
          />
      </div>
    );
}

export default Doctor;