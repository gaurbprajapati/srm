import React from "react";
import DefaultLayout from "../components/DefaultLayout";
import '.././resources/Home.css'
import { Link } from 'react-router-dom';
import student from "../images/students.png"

function Home() {
    return (
        <>
            <DefaultLayout>
                <div className="hero-section" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '50px 0' }}>
                    <div className="hero-content" style={{ maxWidth: '50%', lineHeight: '1.6' }}>
                        <h1 style={{ marginBottom: '20px' }}>Cloud Campus Nexus</h1>
                        <h2 style={{ marginBottom: '20px' }}>Professional Connection and Development</h2>
                        <h4 style={{ marginBottom: '20px' }}>the one-stop destination for all the clubs on campus! Here, you
                            will find a diverse range of clubs that cater to a wide variety of
                            interests and passions. Our clubs offer opportunities for personal
                            growth, skill development, and social engagement, providing a
                            platform for students to connect with like-minded peers and
                            explore their interests.</h4>
                        <Link to='/profile'>
                            <button style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '5px', cursor: 'pointer' }}>Get Started</button>
                        </Link>
                    </div>
                    <div className="hero-image">
                        <img src={student} alt="Hero" style={{ width: '100%', height: 'auto' }} />
                    </div>
                </div>
            </DefaultLayout>
        </>
    );
}

export default Home;