import { Outlet } from 'react-router-dom'
const ParentView = () => {
    // ...
    return (
      <div>
        <Outlet></Outlet>
        {/* ... */}
      </div>
    );
}

export default ParentView;