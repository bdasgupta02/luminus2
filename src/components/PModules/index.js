import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardActions, Grid, Button, Stack, CircularProgress } from '@mui/material'
import { PlusIcon } from '@primer/octicons-react'
import SearchInput, { createFilter } from 'react-search-input'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../firebase'
import './pModules.css'

/**
 * Notes:
 * - if isProf, then show settings
 * - currentUser.multiFactor.user.uid
 */
const PModules = (props) => {
    const [searchText, setSearchText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [modules, setModules] = useState([])
    const { currentUserId, isProf } = useAuth()

    console.log('isProf: ' + isProf)

    // DB
    const modRef = db.collection('users').doc(currentUserId).collection('modulesRegistered')
    const getModules = () => {
        setIsLoading(true)
        modRef.onSnapshot((querySnapshot) => {
            const items = []
            querySnapshot.forEach((doc) => {
                if (typeof doc.data().init !== 'undefined' && doc.data().init !== null && doc.data().init !== true) {
                    doc.data().module.get().then((snap) => {
                        const modInner = modules.findIndex(x => x.code === snap.data().code) === -1 ? snap.data() : null
                        setModules(modInner !== null ? [...modules, modInner] : modules)
                    })
                }
            })
            setIsLoading(false)
        })
    }

    useEffect(() => {
        getModules()
    }, [])



    // Searching
    const keysToFilter = ["code", "title", "description"]
    let searchedMods = []
    if (searchText !== null && searchText !== '') {
        searchedMods = modules.filter(createFilter(searchText, keysToFilter))
    } else {
        searchedMods = modules
    }
    const handleSearch = (term) => {
        setSearchText(term)
    }


    console.log(searchText)
    return (
        <div style={{ width: "90%" }}>
            <Stack spacing={1}>
                <div id="PModTitle">
                    {"Search for slots"}
                </div>

                {isProf ? (
                    <Grid>
                        <Button variant="outlined" size="small" className="PModButton" startIcon={<PlusIcon />}>Create new module</Button>
                    </Grid>
                ) : null}

                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <SearchInput id="PModSearchBox" fuzzy value={searchText} onChange={handleSearch} placeholder="Search for modules" />
                    </Grid>

                    {isLoading ? <CircularProgress /> : null}

                    <Grid container justify="center" spacing={2} style={{ margin: "19px" }}>
                        {searchedMods.map((mod) => (
                            <Grid item>
                                <Card className="PModCard">
                                    <CardContent>
                                        <div style={{ fontWeight: "bold" }}>{mod.title}</div>
                                        <div>{mod.code}</div>
                                        <div>{mod.description}</div>
                                    </CardContent>
                                    <CardActions>
                                        <Button style={{ fontWeight: "bold" }} size="small">View module</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                </Grid>
            </Stack>
        </div>
    )
}

export default PModules
