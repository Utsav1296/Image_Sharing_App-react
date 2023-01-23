import React, { useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { client } from '../client'
import Spinner from './spinner'
import { categories } from '../utils/data'
// import { BsFillEggFill } from 'react-icons/bs'

const CreatePin = ({ user }) => {
    // console.log(user)
    const [title, setTitle] = useState('')
    const [about, setAbout] = useState('')
    const [destination, setDestination] = useState('')
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState(null)
    const [category, setCategory] = useState(null)
    const [imageAsset, setImageAsset] = useState()
    const [wrongImageType, setWrongImageType] = useState(false)

    const navigate = useNavigate();

    const uploadImage = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff') {
            // console.log(imageAsset)
            setWrongImageType(false)
            setLoading(true)
            client.assets
                .upload('image', selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
                .then((document) => {
                    setImageAsset(JSON.stringify(document));
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Upload failed:', error.message)
                })
            // console.log(imageAsset)
        } else {
            setLoading(false)
            setWrongImageType(true)
        }
    }

    const savePin = () => {
        if (title && about && destination && JSON.parse(imageAsset)?._id && category) {
            const doc = {
                _type: 'pin',
                title,
                about,
                destination,
                image: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: JSON.parse(imageAsset)?._id,
                    },
                },
                userId: user._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id,
                },
                category,
            };

            client.create(doc).then((res) => {
                console.log(`Doc was created, document ID is ${res._id}`)
                navigate('/')
                window.location.reload()
            })
        } else {
            console.log(title, about, destination, JSON.parse(imageAsset)?._id, category)
            setFields(true)
            setTimeout(() => {
                setFields(false)
            }, 2000);
        }
    }


    return (
        <div className="flex bg-gray-50 mt-5 flex-col justify-center items-center gap-3 p-5 lg:h-3/5">
            {/* error  */}
            {fields && (
                <p className='text-red-500 mb-5 text-xl transition-all duration-200'>Please fill all the fields to upload...</p>
            )}

            {/* main container */}
            <div className="flex flex-col w-full lg:flex-row lg:justify-around">

                {/* uploader */}
                {!imageAsset ?
                    (<label className="bg-gray-200 flex flex-col justify-center items-center p-4 lg:max-w-sm">
                        <div className=" border-dotted border-gray-400 border-2 w-full flex flex-col items-center justify-around h-370">
                            <div className='flex flex-col items-center'>
                                {loading && (
                                    <Spinner />
                                )}
                                {
                                    wrongImageType && (
                                        <p className='text-red-500'>It&apos;s wrong file type.</p>
                                    )
                                }
                                <AiOutlineCloudUpload className='mt-10 text-black text-3xl' />
                                <p className='text-black font-semibold'>Click to upload</p>
                            </div>
                            <p className='text-gray-400 text-center'>Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB</p>
                        </div>
                        <input type="file" name="image-uploader" className='w-0 h-0' onChange={uploadImage} />
                    </label>) : (
                        <div className="relative h-full">
                            <img
                                src={JSON.parse(imageAsset)?.url}
                                alt="uploaded-pic"
                                className="h-full w-full"
                            />
                            {/* {console.log('imageAsset', JSON.parse(imageAsset))} */}
                            <button
                                type="button"
                                className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                                onClick={() => setImageAsset(null)}
                            >
                                <MdDelete />
                            </button>
                        </div>
                    )}

                {/* pin detail  */}
                <div className="flex flex-col gap-8 mt-3 p-2">
                    {user && (<><input type="text" name="title" id="title" placeholder='Add your title' className='text-black font-bold text-3xl px-4 py-2 outline-none border-b-2 border-pink-300' onClick={e => setTitle(e.target.value)} />
                        <div className="flex gap-2 items-center">
                            <img src={user?.image} className='rounded-full h-12 w-12' />
                            <p className='uppercase text-gray-900 font-bold'>{user?.userName}</p>
                        </div></>)}
                    <input type="text" name="about" id="about" placeholder='Tell everyone what your Pin is about' className='text-black font-bold text-lg px-4 py-2 outline-none border-b-2 border-pink-300 w-full' onChange={e => setAbout(e.target.value)} />
                    <input type="text" name="destination" id="destination" placeholder='Add a destination link' className='text-black font-bold text-lg px-4 py-2 outline-none border-b-2 border-pink-300 w-full' onChange={e => setDestination(e.target.value)} />
                    <label htmlFor="cars" className='text-black capitalize font-bold'>Choose pin category </label>
                    <div className="flex flex-col w-4/5">
                        <select
                            onChange={(e) => {
                                setCategory(e.target.value);
                            }}
                            className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                        >
                            <option value="others" className="sm:text-bg bg-white" key='others'>Select Category</option>
                            {categories.map((item) => (
                                <option className="text-base border-0 outline-none capitalize bg-white text-black " value={item.name} key={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end items-end mt-2"><button type="button" className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none" onClick={savePin}>Save Pin</button></div>
                </div>
            </div>
        </div >
    )
}

export default CreatePin