import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardActions, Grid, Stack, CircularProgress } from '@mui/material'
import { PlusIcon, SearchIcon, XIcon } from '@primer/octicons-react'
import SearchInput, { createFilter } from 'react-search-input'
import { Row, Col } from 'react-grid-system'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../Button'
import ModCode from './ModCode'
import { db } from '../../firebase'
import FullPageWrapper from '../FullPageWrapper'
import { useHistory } from 'react-router-dom'
import ReactModal from 'react-modal'
import './pModules.css'

/**
 * Notes:
 * - if isProf, then show settings
 * - currentUser.multiFactor.user.uid
 */
const PModules = (props) => {
    const [newModDetails, setNewModDetails] = useState({
        code: '',
        title: '',
        description: ''
    })
    const [modalVisible, setModalVisible] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [modules, setModules] = useState([])
    const { currentUserId, isProf } = useAuth()
    const history = useHistory()







    // DB
    useEffect(() => {
        const fetch = async () => {
            const mods = await db.collection('users').doc(currentUserId).collection('modulesRegistered').get()

            const res = []
            let i = 0, len = mods.docs.length
            while (i < len) {
                if (mods.docs[i].data().init === false) {
                    const innerRes = await db.collection('modules').doc(mods.docs[i].data().module.id).get()
                    res.push(innerRes.data())
                }
                i++;
            }
            setModules(res)
        }
        fetch()
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






    // Creation of module
    const handleModInput = (event, type) => {
        setNewModDetails({
            ...newModDetails,
            [type]: event.target.value
        })
    }
    const handleCreateMod = async () => {
        // null checks
        if (newModDetails.code === '' || newModDetails.title === '' || newModDetails.description === '') {
            alert('Error! Some values are empty')
        }

        // mod code check
        const modRef = db.collection('')

        // [create] module document and [edit] to prof's modulesRegistered
        let docId = ''
        await db.collection('modules').add(newModDetails).then((doc) => {
            db.collection('users').doc(currentUserId).collection('modulesRegistered').add({
                init: false,
                module: db.doc('modules/' + doc.id)
            })
            docId = doc.id
        })

        setModalVisible(false)
        history.push("/modules/view_module", { docId: docId })
    }








    return (
        <FullPageWrapper>
            <div style={{ width: "90%" }}>
                <Stack spacing={1}>
                    <div id="PModTitle">
                        {"Search modules"}
                    </div>

                    {isProf ? (
                        <div>
                            <Button variant="contained" size="small" className="PModButton" startIcon={<PlusIcon size={16} />} onClick={() => setModalVisible(true)}>Create new module</Button>
                        </div>
                    ) : null}


                    <Grid container spacing={2} style={{ marginTop: '50px' }}>
                        <Grid item xs={12} md={12}>
                            <SearchInput id="PModSearchBox" fuzzy value={searchText} onChange={handleSearch} placeholder={"Search for modules"} />
                        </Grid>

                        {isLoading ? <CircularProgress /> : null}

                        <Grid container justify="center" spacing={2} style={{ margin: "19px" }} xs={12}>
                            {searchedMods.map((mod) => {
                                mod.title = mod.title.length > 20 ? mod.title.substr(0, 32) + ".." : mod.title
                                mod.description = mod.description.length > 35 ? mod.description.substr(0, 32) + ".." : mod.description
                                //35
                                return (
                                    <Grid item>
                                        <Card className="PModCard">
                                            <CardContent>
                                                <Col style={{ marginLeft: '16px' }}>
                                                    <Row className="PModCardText" style={{ justifyContent: 'flex-end', width: '100%' }}><ModCode code={mod.code} /></Row>
                                                    <Row className="PModCardText" style={{ fontWeight: "bold" }}>{mod.title}</Row>
                                                    <Row className="PModCardText">{mod.description}</Row>
                                                </Col>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small">View module</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )
                            })}
                        </Grid>

                    </Grid>
                </Stack>
            </div>
            <ReactModal isOpen={modalVisible} ariaHideApp>
                <div id="PModCreateModalTitle">
                    {"Create a new module"}
                </div>
                <form>
                    <Col>
                        <Row>
                            <input className="PModInputText" type="text" placeholder="Module code" onChange={(event) => handleModInput(event, 'code')} value={newModDetails.code} />
                        </Row>
                        <div className="PModInputSpacer" />
                        <Row>
                            <input className="PModInputText" type="text" placeholder="Module title" onChange={(event) => handleModInput(event, 'title')} value={newModDetails.title} />
                        </Row>
                        <div className="PModInputSpacer" />
                        <Row>
                            <textarea cols="40" rows="5" className="PModInputTextML" type="text" placeholder="Module description" onChange={(event) => handleModInput(event, 'description')} value={newModDetails.description} />
                        </Row>
                    </Col>
                </form>

                <Button variant="contained" size="small" className="PModButton" startIcon={<PlusIcon size={16} />} onClick={handleCreateMod}>Create module</Button>
                <Button variant="outlined" size="small" className="PModButton" startIcon={<XIcon size={16} />} onClick={() => setModalVisible(false)}>Cancel</Button>

            </ReactModal>
        </FullPageWrapper>
    )
}

export default PModules
