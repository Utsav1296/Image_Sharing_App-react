import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'
import { googleLogout, GoogleOAuthProvider } from '@react-oauth/google'
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data'
import { client } from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import NotFound from "../assets/notFound.svg";
import { fetchUser } from '../utils/fetchUser';


// const myRandomImage = 'https://source.unsplash.com/collection/928423/1600x900'
const randomImage = `https://source.unsplash.com/1600x900/?dreams,nature,wildlife,photography,technology,culture`

const activeBtnStyles = 'bg-orange-500 p-2 text-white font-bold rounded-full w-20 outline-none'
const notActiveBtnStyles = 'bg-primary mr-4 p-2 text-black font-bold rounded-full w-20 outline-none'

const UserProfile = () => {
    const [user, setUser] = useState(null)
    const [pins, setPins] = useState(null)
    const [text, setText] = useState('created')//saved
    const [activeBtn, setActiveBtn] = useState('created')
    const navigate = useNavigate()
    const { userId } = useParams()
    const loggedUser = fetchUser();

    const [loading, setLoading] = useState(true)
    setTimeout(() => {
        setLoading(false); // stops the interval after 2.5 seconds
    }, 2500);
    // console.log(user?._id)
    // console.log(loggedUser.sub)

    useEffect(() => {
        const query = userQuery(userId)
        // console.log("user ka id", userId)
        client
            .fetch(query)
            .then(res => {
                setUser(res[0])
            })
    }, [userId])

    useEffect(() => {
        if (activeBtn === 'created') {
            const createdPinsQuery = userCreatedPinsQuery(userId)
            client
                .fetch(createdPinsQuery)
                .then(data => setPins(data))
        } else {
            const savedPinsQuery = userSavedPinsQuery(userId)
            client
                .fetch(savedPinsQuery)
                .then(data => setPins(data))
        }
    }, [activeBtn, userId])


    const logout = () => {
        localStorage.clear();
        googleLogout()
        navigate('/login');
    };



    if (!user) { <Spinner message={'Loading profile'} /> }
    return (
        <div className="relative pb-2 h-full justify-center items-center">
            <div className="flex flex-col pb-5">
                <div className="relative flex flex-col mb-7">
                    <div className="flex flex-col justify-center items-center">
                        <img src={randomImage} alt="banner_pic" className='w-full h-370 2xl:h-510 shadow-xl shadow-rose-300 object-cover' />
                        {user?.image && (<img src={user?.image} alt="" className='rounded-full w-24 h-24 -mt-12 shadow-blue-300 shadow-xl object-cover' />)}
                        <h1 className='capitalize mt-3 text-black text-3xl font-bold'>{user?.userName}</h1>
                        {/* logout logic  */}
                        <div className="absolute top-0 right-0 p-2 z-40">
                            {/* check here the id matching  */}
                            {userId === loggedUser.sub && (
                                <button
                                    type='button'
                                    className='b-2 p-2 bg-gray-300 rounded-full cursor-pointer outline-none shadow-md shadow-yellow-600 opacity-80 hover:opacity-100'
                                    onClick={logout}>
                                    <AiOutlineLogout color='red' fontSize={21} fontWeight={700} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="text-center mt-3 mb-7">
                        <button
                            type='button'
                            onClick={e => {
                                setText(e.target.textContent)
                                setActiveBtn('created')
                                setLoading(true)
                            }}
                            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
                        >
                            Created
                        </button>
                        <button
                            type='button'
                            onClick={e => {
                                setText(e.target.textContent)
                                setActiveBtn('saved')
                            }}
                            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
                        >
                            Saved
                        </button>
                    </div>
                    {pins?.length ? (<div className="px-2">
                        <MasonryLayout pins={pins} />
                    </div>) : (
                        <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>
                            {loading ? <Spinner message={`looking for ${activeBtn} pins`} /> : (
                                <div className="w-full h-[350px] flex flex-col justify-center items-center">
                                    <p>Sorry 🙇 No Pins Available</p>
                                    <img src={NotFound} className="w-[30%] mt-5" alt="" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserProfile