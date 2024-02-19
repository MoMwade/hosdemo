// import { useEffect } from 'react';
// import { useRequest } from 'ahooks';
import Filter from '@/components/filter';
import { getPayorderList } from '@/service';

const Payorder = () => {
  getPayorderList().then((res) =>{console.log(res);})
    return (
      <div>
        <h1>订单列表</h1>
        <div className='w-[70%]'>
          <Filter></Filter>
        </div>
        {/* ... */}
      </div>
    );
}

export default Payorder;