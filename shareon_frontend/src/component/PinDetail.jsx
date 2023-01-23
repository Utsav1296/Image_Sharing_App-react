import React, { useState, useEffect } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { client, urlFor } from '../client'
import MasonryLayout from './MasonryLayout'
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'
import Spinner from './Spinner'

const PinDetail = ({ user }) => {
    const [pins, setPins] = useState(null)
    const [pinDetail, setPinDetail] = useState(null)
    const [comment, setComment] = useState('')
    const [addingComment, setAddingComment] = useState(false)
    const { pinId } = useParams()
    // console.log(user)

    useEffect(() => {
        fetchPinDetails()
        // console.log(pinDetail)
    }, [pinId])

    const fetchPinDetails = () => {
        const query = pinDetailQuery(pinId);

        client.fetch(query).then((res) => {
            setPinDetail(res[0])

            if (res[0]) {
                const newQuery = pinDetailMorePinQuery(res[0])
                client.fetch(newQuery)
                    .then((data) => setPins(data))
            }
        })
    }

    const addComment = () => {
        if (comment) {
            setAddingComment(true)

            client
                .patch(pinId)
                // Ensure that the `reviews` arrays exists before attempting to add items to it
                .setIfMissing({ comments: [] })
                // Add the items after the last item in the array (append)
                .insert('after', 'comments[-1]', [{
                    comment,
                    // _key:uuidv4(),
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user._id
                    }
                }])
                .commit({
                    // Adds a `_key` attribute to array items, unique within the array, to
                    // ensure it can be addressed uniquely in a real-time collaboration context
                    autoGenerateArrayKeys: true,
                })
                .then(() => {
                    fetchPinDetails();
                    setComment('')
                    setAddingComment(false)
                })
        }
    }

    if (!pinDetail) return <Spinner message='Loading pin detail' />
    return (
        <>
            {pinDetail && (
                <div className="flex xl:flex-row flex-col my-8 shadow-md shadow-rose-500 bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
                    {/* image  */}
                    <div className="flex p-2 justify-center items-center md:items-start flex-initial">
                        <img
                            className="rounded-t-3xl rounded-b-lg"
                            src={pinDetail?.image?.asset?.url}
                            alt="user-post"
                        />
                    </div>
                    {/* download and comment  */}
                    <div className="w-full p-5 flex-1 xl:min-w-620">
                        {/* download section & destination link */}
                        <div className="flex items-center justify-between">
                            {/* download btn  */}
                            <div className="flex gap-2 items-center">
                                <a
                                    href={`{pinDetail?.image?.asset?.url}?dl=`}
                                    download
                                    className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            {/* destination detail  */}
                            <a href='' target="_blank" rel="noreferrer">
                                {pinDetail.destination?.slice(8)}
                            </a>
                        </div>
                        {/* title and about details  */}
                        <div>
                            <h1 className="text-4xl font-bold break-words mt-3">
                                {pinDetail.title}
                            </h1>
                            <p className="mt-3">{pinDetail.about}</p>
                        </div>
                        {/* postedBy details  */}
                        <Link to={`/user-profile/${pinDetail?.postedBy?._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
                            <img src={'pinDetail?.postedBy.image'} className="w-10 h-10 rounded-full" alt="" />
                            <p className="font-bold">{pinDetail?.postedBy?.userName}</p>
                        </Link>
                        <h2 className="mt-5 text-2xl">Comments</h2>
                        {/* comment section  */}
                        <div className="max-h-370 overflow-y-auto">
                            {pinDetail?.comments?.map((item) => (
                                <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={item.comment}>
                                    <img
                                        src={item.postedBy?.image}
                                        className="w-10 h-10 rounded-full cursor-pointer"
                                        alt="user-profile"
                                    />
                                    <div className="flex flex-col">
                                        <p className="font-bold">{item.postedBy?.userName}</p>
                                        <p>{item.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap mt-6 gap-3">
                            <Link to={`/user-profile/${user?._id}`}>
                                <img src={user?.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
                            </Link>
                            <input
                                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                                type="text"
                                placeholder="Add a comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button
                                type="button"
                                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                                onClick={addComment}
                            >
                                {addingComment ? 'Doing...' : 'Done'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* {console.log(pins)} */}
            {/* more like this  */}
            {(pins?.length > 0) && (
                <>
                    <h2 className='text-center font-bold texst-2xl text-black'>
                        More like this
                    </h2>
                    {pins ?
                        (<MasonryLayout pins={pins} />) :
                        (<Spinner message={'loading more pins'} />)
                    }
                </>
            )}

        </>
    )
}

export default PinDetail
