import { useState, useRef, useEffect } from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseSquare, AiFillCloseCircle } from 'react-icons/ai'
import logo from '../assets/logo.png'
import { Link, Route, Routes } from 'react-router-dom'

import { Sidebar, UserProfile } from '../component'
import { client } from '../client'
import { userQuery } from '../utils/data'
import Pins from './Pins'
import { fetchUser } from '../utils/fetchUser'

const Home = () => {
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [user, setUser] = useState(null);
    const scrollRef = useRef(null);



    const userInfo = fetchUser();

    useEffect(() => {
        const userId = userInfo?.sub;
        const query = userQuery(userId);

        client.fetch(query)
            .then((data) => {
                setUser(data[0])

            })

    }, [])

    useEffect(() => {
        scrollRef.current.scrollTo(0, 0)
    }, [])





    return (
        <div className="flex bg-gray-100 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
            <div className="hidden md:flex h-screen flex-initial">
                <Sidebar user={user && user} />
            </div>

            <div className="flex flex-row md:hidden">
                <div className="p-2 w-full flex justify-between items-center shadow-md">
                    <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />
                    <Link to='/'>
                        <img src={logo} alt="logo" className='w-16 rounded-lg shadow-xl' />
                    </Link>
                    <Link to={`user-profile/${user?._id}`}>
                        <img src={user?.image} alt="logo" className='w-16 rounded-full' />
                    </Link>
                </div>

            </div>
            {toggleSidebar && (<div className="fixed w-3/5 h-screen overflow-y-scroll bg-white shadow-md z-10 animate-slide-in" ref={scrollRef}>
                <div className="absolute w-full flex justify-end items-center">
                    <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
                </div>
                <Sidebar user={user && user} closeToggle={setToggleSidebar} />
            </div>)}

            <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
                <Routes>
                    <Route path='/user-profile/:userId' element={<UserProfile />} />
                    <Route path={`/*`} element={<Pins user={user && user} />} />
                </Routes>
            </div>
        </div >
    )
}

export default Home