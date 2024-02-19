const FormDate = (obj) => { 
    const form = new FormData();
    for (const key in obj) {
        form.append(key, obj[key])
    }
    return form; // 返回一个包含表单数据的FormData对象
}

export default FormDate;
