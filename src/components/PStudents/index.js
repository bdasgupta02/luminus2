import React, { useState, useEffect } from 'react'
import { db } from '../../firebase'
import SearchInput, { createFilter } from 'react-search-input'
import FullPageWrapper from '../FullPageWrapper'
import ProfileTile from '../ProfileTile'
import { CircularProgress } from '@mui/material'
import './pStudents.css'

// redirect to / if not isProf
// encapsulate in full width div to prevent grid
function PStudents() {
    const [isLoading, setLoading] = useState(false)
    const [students, setStudents] = useState([])
    const [searchText, setSearchText] = useState('')


    // DB
    const fetch = async () => {
        setLoading(true)
        let students = []
        const studentsGet = await db.collection('users').where('isProf', '==', false).get()
        for (let i = 0; i < studentsGet.docs.length; i++) {
            let student = studentsGet.docs[i].data()
            student = { ...student, id: studentsGet.docs[i].id }
            students.push(student)
        }
        setStudents(students)
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
    let searchedStudents = []
    if (searchText !== null && searchText !== '') {
        searchedStudents = students.filter(createFilter(searchText, keysToFilter))
    } else {
        searchedStudents = students
    }


    return (
        <FullPageWrapper>
            <div style={{ paddingLeft: '35px', paddingTop: '90px' }}>
                <div id="PTTitle">
                    Search students
                </div>

                <SearchInput id="PTSearchBox" type="text" placeholder="Search students" onChange={handleSearch} value={searchText} />
                <div style={{ width: '100%', height: '60px' }} />

                {searchedStudents.map(e => (
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

export default PStudents
