import request from "../utils/http";

//登入
export function login(data) {
  return request.post("/api/Login", data);
}

// 获取路由
export function getRouters(params) {
  return request.get("/api/getRouters", { params });
}

// 查询订单列表
export function getPayorderList(params) {
  return request.get("/api/business/Payorder/list", { params });
}

// 查询身体部位列表
export function getBodypartsList(params) {
  return request.get("/api/business/Bodyparts/list", { params });
}

// 添加身体部位
export function getBodypartsAdd(data) {
  return request.post("/api/business/Bodyparts", data);
}

// 删除身体部位
export function getBodypartsDel(params) {
  return request.delete(`/api/business/Bodyparts/${params}`,);
}

// 查询症状列表
export function getSymptomsList(params) {
  return request.get("/api/business/Symptoms/list", { params });
}

// 添加症状
export function geBusinessSymptomsAdd(data) {
  return request.post("/api/business/Symptoms", data);
}

// 查询科室管理列表
export function getDeptList(params) {
  return request.get("/api/business/Dept/list", { params });
}

// 添加科室管理
export function geBusinessDeptAdd(data) {
  return request.post("/api/business/Dept", data);
}

// 查询楼层管理列表
export function getFoordataList(params) {
  return request.get("/api/business/Foordata/list", { params });
}

// 添加楼层管理
export function geBusinessFoordataAdd(data) {
  return request.post("/api/business/Foordata", data);
}

// 查询会员表列表
export function getMemberList(params) {
  return request.get("/api/business/Member/list", { params });
}

// 添加会员表
export function getBusinessMemberAdd(data) {
  return request.post("/api/business/Member", data);
}

// 获取会员表
export function getMemberExport(params) {
  return request.get("/api/business/Member/export", { params });
}

// 查询医生(专家)列表
export function getDoctorList(params) {
  return request.get("/api/business/Doctor/list", { params });
}
// 添加医生(专家)
export function getBusinessDoctorAdd(data) {
  return request.post("/api/business/Doctor", data);
}

// 删除医生(专家)
export function getBusinessDoctorDel(params) {
  return request.delete(`/api/business/Doctor/${params}`,);
}

// 更新医生(专家)
export function getBusinessDoctorEdit(data) {
  return request.put("/api/business/Doctor", data);
}

// 查询部门树状列表
export function getSystemDepttreeselect(params) {
  return request.get("/api/system/dept/treeselect", { params });
}

// 查询部门列表
export function getSystemDeptlist(params) {
  return request.get("/api/system/dept/list", { params });
}

// 添加部门
export function getSystemDeptAdd(data) {
  return request.post("/api/system/dept", data);
}

// 删除部门
export function getSystemDeptDel(params) {
  return request.delete(`/api/system/dept/${params}`,);
}

// 更新部门
export function getSystemDeptEdit(data) {
  return request.put("/api/system/dept", data);
}

// 查询登录日志
export function getMonitorLogininforlist(params) {
  return request.get("/api/monitor/logininfor/list", { params });
}

// 删除登录日志
export function getMonitorLogininforDel(params) {
  return request.delete(`/api/monitor/logininfor/${params}`,);
}

// 清空登录日志 
export function getMonitorLogininforclean() {
  return request.delete(`/api/monitor/logininfor/clean`,);
}

// 查询菜单列表
export function getSystemMenuList(params) {
  return request.get("/api/system/menu/list", { params });
}

// 查询菜单下拉树列表
export function getSystemMenuTreeSelect() {
  return request.get("/api/system/menu/treeSelect");
}

// 查询操作日志
export function getMonitorOperlogList(params) {
  return request.get("/api/monitor/operlog/list", { params });
}

// 删除操作日志
export function getMonitorOperlogDel(params) {
  return request.delete(`/api/monitor/operlog//${params}`,);
}

// 清空操作日志 
export function getMonitorOperlogclean() {
  return request.delete(`/api/monitor/operlog/clean`,);
}

// 查询意见反馈
export function getBusinessFeedbackList(params) {
  return request.get("/api/business/Feedback/list", { params });
}

// 查询角色管理信息
export function getSystemRoleList(params) {
  return request.get("/api/system/role/list", { params });
}

// 根据角色编号获取已分配的用户
export function getSystemuserRoleGet(params) {
  return request.get(`/api/system/userRole/get/${params}`);
}

// 获取未分配用户角色
export function getSystemuserGetExcludeUsers(params) {
  return request.get(`/api/system/userRole/GetExcludeUsers/`, {params});
}

// 添加用户角色
export function getSystemUserRoleCreate(data) {
  return request.post("/api/system/userRole/create", data);
}

// 删除用户角色
export function getSystemUserRoleDelete(data) {
  return request.post("/api/system/userRole/delete", data);
}