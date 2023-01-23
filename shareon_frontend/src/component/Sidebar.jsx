import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { RiHomeFill } from 'react-icons/ri'
import { IoIosArrowForward } from 'react-icons/io'
import logo from '../assets/logo.png'

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize'
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize'

import { categories } from '../utils/data'
// const categories = [{ name: 'Animals' }, { name: 'Wallpaper' }, { name: 'Gaming' }, { name: 'Photography' }, { name: 'Coding' }, { name: 'Other' },]

const Sidebar = ({ user, closeToggle }) => {
    const handleCloseSidebar = () => {
        if (closeToggle) closeToggle(false);
    }
    // console.log(user)
    return (
        <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
            <div className="flex flex-col">
                <Link
                    to={`/`}
                    className='flex pt-1 my-6 gap-2 w-190 items-center'
                    onClick={handleCloseSidebar}
                >
                    <img src={logo} alt="logo" className='w-24 mx-10 drop-shadow-md hover:drop-shadow-xl rounded-3xl' />
                </Link>
                <div className="flex flex-col gap-5">
                    <NavLink
                        to='/'
                        className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
                        onClick={handleCloseSidebar}>
                        <RiHomeFill />
                        Home
                    </NavLink>
                    <h3 className="px-5 mt-2 text-base 2xl:text-xl"> Discover Categories</h3>
                    {categories.slice(0, categories.length - 1).map((category) => (
                        <NavLink to={`/category/${category.name}`}
                            className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
                            onClick={handleCloseSidebar}
                            key={category.name}>
                            <img src={category.image} className='w-8 h-8 rounded-full shadow-sm' alt={category} />
                            {category.name}
                        </NavLink>
                    ))}
                </div>
            </div>
            {
                user && (
                    <Link
                        to={`user-profile/${user._id}`}
                        className='flex flex-row items-center gap-2 my-5 mx-3 mb-2 border-b-4 border-zinc-400 rounded-lg shadow-md shadow-rose-300'>
                        <img src={user?.image} alt="user" className='w-10 h-10 rounded-full shadow-lg' />
                        <p className='font-bold text-zinc-700'>{user.userName} </p>
                        <IoIosArrowForward />
                    </Link>
                )
            }
        </div>
    )
}

export default Sidebar