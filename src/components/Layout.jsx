import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <>
            <Navbar />
            <main style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
                <Outlet />
            </main>
        </>
    );
};

export default Layout;
