import Login from '@/views/Login';
import { Navigate } from 'react-router-dom';

let staticRouters = [
    {path: '/login', element: <Login />,},
    {path: '/', element: <Navigate to="/login" />}
];

export default staticRouters;