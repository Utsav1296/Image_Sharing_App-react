import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'

import { client, urlFor } from '../client'
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
    // console.log([postedBy, image, _id, destination, save])

    const [postHovered, setPostHovered] = useState(false)
    // const [savingPost, setSavingPost] = useState(false)
    const navigate = useNavigate();

    const user = fetchUser();
    const saveBtnClass = 'bg-red-500 rounded-lg text-base p-1 font-semibold text-white capitalize opacity-70 outline-none hover:opacity-100 hover:shadow-md'
    // console.log(user.picture)

    const alreadySaved = !!(save?.filter((item) => item?.postedBy?._id === user?.sub).length)

    const savePin = (id) => {
        if (!alreadySaved) {
            // setSavingPost(true);

            client
                .patch(id)
                // Ensure that the `save` arrays exists before attempting to add items to it
                .setIfMissing({ save: [] })
                // Add the items after the last item in the array (append)
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user?.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user?.sub
                    }
                }])
                .commit({
                    // Adds a `_key` attribute to array items, unique within the array, to
                    // ensure it can be addressed uniquely in a real-time collaboration context
                    autoGenerateArrayKeys: true,
                })
                .then(() => {
                    window.location.reload();
                    // setSavingPost(false)
                })
        }
    }

    const deletePin = (id) => {
        // if(alreadySaved){}
        client
            .delete(id)
            .then(() => {
                window.location.reload()
            })
            .catch((err) => {
                console.error('Delete failed: ', err.message)
            })
    }

    return (
        <div className='m-2 hover:scale-95 transition delay-100 duration-200 ease-in-out'>
            <div className="relative cursor-zoom-in w-auto overflow-hidden hover:shadow-lg rounded-lg transition-all duration-500"
                onMouseEnter={() => { setPostHovered(true) }}
                onMouseLeave={() => { setPostHovered(false) }}
                onClick={() => navigate(`/pin-detail/${_id}`)}>

                <img className='rounded-lg w-full' alt='user-post' src={urlFor(image).width(250).url()} />
                {postHovered && (<>
                    <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-30" style={{ height: '100%' }}>
                        <div className="flex items-center justify-between">

                            <div className="flex gap-2">
                                <a href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={e => e.stopPropagation()}>
                                    <MdDownloadForOffline className='w-9 h-9 flex items-center justify-center text-black bg-white outline-none text-xl text-dark rounded-full opacity-75 hover:opacity-100' />
                                </a>
                            </div>
                            {(alreadySaved) ?
                                (<button className={saveBtnClass}
                                    onClick={(e) => e.stopPropagation()}>{save.length} Saved </button>) :
                                (<button className={saveBtnClass}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        savePin(_id)
                                    }}>
                                    Save
                                </button>)}
                        </div>
                        <div className='flex items-center justify-between'>
                            <a href={destination}
                                target='_blank'
                                className="bg-gray-300 flex justify-around items-center gap-1 px-2 py-1 rounded-3xl opacity-70 hover:opacity-100"
                                onClick={e => e.stopPropagation()}>
                                <BsFillArrowUpRightCircleFill />
                                {destination?.length > 20 ? (destination.slice(8, 22) + '...') : (destination.slice(8))}
                            </a>
                            {(postedBy?._id === user?.sub) && (<button className='bg-white px-2 py-1 rounded-full text-black hover:scale-110 opacity-70 hover:opacity-100'
                                onClick={e => {
                                    e.stopPropagation()
                                    deletePin(_id)
                                }}>
                                <AiTwotoneDelete />
                            </button>)}
                        </div>
                    </div>
                </>
                )}
            </div>
            <Link to={`user-profile/${postedBy?._id}`} className="flex justify-between items-center mt-1 py-1 px-2 bg-gray-200 rounded-lg border-zinc-500 hover:shadow-xl hover:shadow-pink-200/50">
                <img src={postedBy?.image} className='h-8 w-8 rounded-full shadow-2xl' />
                <p className='text-gray-700 capitalize font-mono font-semibold'>{postedBy?.userName}</p>
            </Link>
        </div >
    )
}

export default Pin