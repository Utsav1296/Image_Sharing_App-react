import React, { useEffect, useState } from 'react'

import MasonryLayout from './MasonryLayout'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import Spinner from './Spinner'

const Search = ({ searchTerm, setSearchTerm }) => {
    const [pins, setPins] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (searchTerm) {
            setLoading(true)
            const query = searchQuery(searchTerm.toLowerCase())
            client.fetch(query)
                .then(data => {
                    setPins(data)
                    setLoading(false)
                })
        } else {
            const query = feedQuery()
            client.fetch(query)
                .then(data => {
                    setPins(data)
                    setLoading(false)
                })
        }
    }, [searchTerm])


    return (
        <div>
            {loading && <Spinner message="Searching For Pins" />}
            {pins?.length !== 0 && <MasonryLayout pins={pins} />}
            {pins?.length === 0 && searchTerm !== "" && !loading && (<div className='mt-10 text-xl text-center'>No Pins Found</div>)}

        </div>
    )
}

export default Search