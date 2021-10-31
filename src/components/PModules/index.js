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




    // Some styles
    const searchBarStyle = { marginLeft: "20px", height: "30px", width: "100%", marginTop: "20px", marginRight: "35px" }
    const buttonStyle = { marginLeft: "35px", marginTop: "18px" }

    return (
        <div style={{ width: "90%" }}>
            <Stack spacing={1}>
                <div id="PModTitle">
                    {"Search for slots"}
                </div>

                {isProf ? (
                    <Grid item xs={6} md={4}>
                        <Button variant="outlined" size="small" style={buttonStyle} startIcon={<PlusIcon />}>Create new module</Button>
                    </Grid>
                ) : null}

                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <SearchInput className="search-input" style={searchBarStyle} fuzzy />
                    </Grid>
                    <Grid item xs={6} md={8}>
                        <Button variant="contained" size="small" style={buttonStyle}>Search</Button>
                    </Grid>

                    {isLoading ? <CircularProgress /> : null}

                    <Grid container justify="center" spacing={2} style={{ margin: "19px" }}>
                        {modules.map((mod) => (
                            <Grid item xs={12} md={2}>
                                <Card style={{ border: "1px solid #d1d1d1", borderRadius: "6px", width: '200px' }}>
                                    <CardContent>
                                        <div style={{ fontWeight: "bold" }}>{mod.title}</div>
                                        <div>{mod.code}</div>
                                        <div>{mod.description}</div>
                                    </CardContent>
                                    <CardActions>
                                        <Button style={{ fontWeight: "bold" }} size="small">View slot</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                </Grid>
            </Stack>
            {modules.length}
        </div>
    )
}

export default PModules
