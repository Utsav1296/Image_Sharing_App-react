import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import MasonryLayout from './MasonryLayout'
import NotFound from "../assets/notFound.svg";
import Spinner from './Spinner'

import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'

const Feed = () => {
    const [loading, setLoading] = useState(false);
    const [pins, setPins] = useState(null)
    const { categoryId } = useParams();
    // console.log(categoryId)

    useEffect(() => {
        setLoading(true);
        if (categoryId) {
            const query = searchQuery(categoryId)

            client.fetch(query)
                .then((data) => {
                    setPins(data);
                    setLoading(false);
                })
        } else {
            const query = feedQuery()
            client.fetch(query)
                .then((data) => {
                    setPins(data);
                    setLoading(false);
                })
        }
    }, [categoryId])


    if (loading) return <Spinner message='We are adding new ideas to your feed!' />

    if (!pins?.length) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center">
                <p>Sorry 🙇 No Feed Available</p>
                <img src={NotFound} className="w-[30%] mt-5" alt="" />
            </div>
        )
    };
    return (
        <div>
            {pins && <MasonryLayout pins={pins} />}
        </div>
    )
}

export default Feed