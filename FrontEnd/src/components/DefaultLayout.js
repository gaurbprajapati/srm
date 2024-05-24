// import React from 'react';
// import './../resources/defaultlayout.css'
// // import { Button, Menu } from "antd";
// import { useNavigate, Link } from 'react-router-dom';
// // import { UserOutlined } from "@ant-design/icons";


// function DefaultLayout(props) {
//     // const user = JSON.parse(localStorage.getItem('sheyresume-user'))
//     const navigate = useNavigate();

//     return (
//         <>
//             <div className='layout'>
//                 <div className='header'>
//                     <h1 onClick={() => navigate('/home')} style={{ cursor: 'pointer', fontSize: '40px', fontStyle: 'bold' }}>GrowUp</h1>


//                     <div style={{ marginLeft: '900px', color: "white", border: 'none' }} >
//                         <Link to='/home'><h1>Home</h1></Link>
//                     </div>
//                     <div style={{ marginleft: '90px' }}>
//                         <Link to='/profile'>
//                             <h1>Profile</h1>
//                         </Link>
//                     </div>

//                     <div style={{ marginleft: '90px' }}>
//                         <Link to='/templates'>
//                             <h1>Templates</h1>
//                         </Link>
//                     </div>
//                     <div onClick={() => {
//                         localStorage.removeItem("sheyresume-user");
//                         navigate("/login");
//                     }} name='Primary' > <Link><h1>Logout</h1></Link></div>
//                 </div>



//                 {/* <div className='content'>
//                 {props.children}
//             </div> */}

//                 {/* <div className="content" style={{ overflow: 'scroll' }}>{props.children}</div> */}
//                 <div className="content" >{props.children}</div>



//             </div >



//         </>
//     )


// }


// export default DefaultLayout

import React from 'react';
import './../resources/defaultlayout.css'
import { Dropdown, Menu } from "antd";
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined } from "@ant-design/icons";
import './DefaultLayout.css'

function DefaultLayout(props) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("sheyresume-user"));
    const menu = (
        <Menu>
            <Menu.Item key="0">
                <Link to='/home'>Home</Link>
            </Menu.Item>
            <Menu.Item key="1">
                <Link to='/profile'>Profile</Link>
            </Menu.Item>
            <Menu.Item key="2">
                <Link to='/templates'>Templates</Link>
            </Menu.Item>
            <Menu.Item key="4">
                <Link to='/learning'>Study Material</Link>
            </Menu.Item>

            <Menu.Item key="3" onClick={() => {
                localStorage.removeItem("sheyresume-user");
                navigate("/login");
            }}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <div className='layout'>
                <div className='header'>
                    <h1 onClick={() => navigate('/home')} style={{ cursor: 'pointer', fontSize: '40px', fontStyle: 'bold' }}>GrowUp</h1>

                    <h1 onClick={() => navigate('/clubs')} style={{ cursor: 'pointer', fontSize: '40px', fontStyle: 'bold' }}>clubs</h1>
                    <h1 onClick={() => navigate('/jobs')} style={{ cursor: 'pointer', fontSize: '40px', fontStyle: 'bold' }}>Jobs</h1>

                    {/* <h1 onClick={() => navigate('/learning')} style={{ cursor: 'pointer', fontSize: '40px', fontStyle: 'bold' }}>Study Material</h1> */}
                    <Dropdown overlay={menu} trigger={['click']}>
                        <button className="user-button">
                            {user.firstName} <UserOutlined className="user-icon" />
                        </button>
                    </Dropdown>
                </div>

                <div className="content" >{props.children}</div>
            </div >
        </>
    )
}

export default DefaultLayout