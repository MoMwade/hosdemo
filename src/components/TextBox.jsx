import { Input } from 'antd';

const TextBox = (props) => {
    const isChildren = props.children
    ? <div className='w-[80%]'>{props.children}</div>
    : <Input value={props.value} onChange={(e)=>{props.setValue(e.target.value)}} id={props.label} size="large" className='w-[60%]' />;
    return(
        <div className={`${props.className} flex justify-between items-center mb-[30px]`}>
            <label htmlFor={props.label} className='whitespace-nowrap text-[18px] font-black text-[#555]'>{props.label}</label>
            {isChildren}
        </div>
    )
}

export default TextBox;