import React, { useState, useEffect } from 'react'
import { db } from '../../firebase'
import SearchInput, { createFilter } from 'react-search-input'
import FullPageWrapper from '../FullPageWrapper'
import ProfileTile from '../ProfileTile'
import { CircularProgress } from '@mui/material'
import './professors.css'

function SearchProfessors() {
    const [isLoading, setLoading] = useState(false)
    const [professors, setProfessors] = useState([])
    const [searchText, setSearchText] = useState('')


    // DB
    const fetch = async () => {
        setLoading(true)
        let profs = []
        const profsGet = await db.collection('users').where('isProf', '==', true).get()
        for (let i = 0; i < profsGet.docs.length; i++) {
            let professor = profsGet.docs[i].data()
            professor = { ...professor, id: profsGet.docs[i].id }
            profs.push(professor)
        }
        setProfessors(profs)
        setLoading(false)
    }

    useEffect(() => {
        fetch()
    }, [])


    // ops
    const handleSearch = (term) => {
        setSearchText(term)
    }

    const keysToFilter = ["name", "nusnet", "email"]
    let searchedProfessors = []
    if (searchText !== null && searchText !== '') {
        searchedProfessors = professors.filter(createFilter(searchText, keysToFilter))
    } else {
        searchedProfessors = professors
    }


    return (
        <FullPageWrapper>
            <div style={{ paddingLeft: '35px', paddingTop: '90px' }}>
                <div id="SPTitle">
                    Search students
                </div>

                <SearchInput id="SPSearchBox" type="text" placeholder="Search professors" onChange={handleSearch} value={searchText} />
                <div style={{ width: '100%', height: '60px' }} />

                {searchedProfessors.map(e => (
                    <ProfileTile {...e} />
                ))}

                {isLoading && (
                    <div style={{ marginLeft: '35px' }}>
                        <CircularProgress />
                    </div>
                )}
            </div>
        </FullPageWrapper>
    )
}

export default SearchProfessors
