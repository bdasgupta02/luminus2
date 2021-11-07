import React, { useState, useEffect } from 'react'
import { Box, Tabs, Tab, Typography, CircularProgress } from '@mui/material'
import FullPageWrapper from '../FullPageWrapper';
import { db } from '../../firebase';
import { useLocation, useHistory } from 'react-router-dom'
import ModCode from '../ModCode';
import { useAuth } from '../../contexts/AuthContext'
import { Row, Col } from 'react-grid-system';
import StudentList from './StudentList';
import ReactModal from 'react-modal';
import Button from '../Button'
import { PlusIcon, XIcon } from '@primer/octicons-react';
import ProfList from './ProfList'
import ProfileTile from '../ProfileTile';
import ForumTile from './ForumTile';
import SearchInput, { createFilter } from 'react-search-input'
import './pModuleView.css'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


/**
 * Origin:
 * history = useHistory()
 * history.push("/path", object)
 * 
 * Destination:
 * location = useLocation().state
 * 
 */




function PModuleView(props) {
    const location = useLocation().state
    const history = useHistory()
    const { docId } = location

    // potential users
    const [potentialProfs, setPotentialProfs] = useState([])
    const [potentialStu, setPotentialStu] = useState([])

    // modals
    const [profModalVisible, setProfModalVisible] = useState(false)
    const [stuModalVisible, setStuModalVisible] = useState(false)

    // tabs
    const [value, setValue] = useState(0)

    // current students and profs
    const [students, setStudents] = useState([])
    const [profs, setProfs] = useState([])

    // search 
    const [searchTerm, setSearchTerm] = useState('')

    // current users
    const { currentUserId, isProf } = useAuth()

    // create forum
    const [forumModalVisible, setForumModalVisible] = useState(false)
    const [newForumDetails, setNewForumDetails] = useState({
        title: '',
        description: '',
    })

    // forums
    const [forums, setForums] = useState([])
    const [isLoading, setLoading] = useState(false)

    // mod itself
    const [details, setDetails] = useState({
        code: '',
        title: '',
        description: ''
    })


    // DB
    const fetch = async () => {
        setLoading(true)
        const modRef = db.collection('modules').doc(docId)
        const modGet = await modRef.get()
        const modData = modGet.data()
        setDetails(modData)

        // get profs and students
        const userRef = db.collection('users')
        const userGet = await userRef.get()

        let users = []
        userGet.forEach(e => {
            users.push(e)
        })

        // filter profs and students
        let studentsRes = []
        let profsRes = []
        let potStuRef = []
        let potProfRef = []
        let i = 0, len = users.length
        while (i < len) {

            const checkResRef = db.collection('users').doc(users[i].id).collection('modulesRegistered')
            const checkResGet = await checkResRef.where('module', '==', modRef).get()
            let user = users[i].data()
            user = { ...user, id: users[i].id }

            if (checkResGet.docs.length > 0) {
                // getting users who have this mod 
                if (user.isProf === true) {
                    profsRes.push(user)
                } else {
                    studentsRes.push(user)
                }
            } else {
                // potential profs and students to add (who are not added yet)
                if (user.isProf === true) {
                    potProfRef.push(user)
                } else {
                    potStuRef.push(user)
                }
            }
            i++
        }

        // fetch forums
        let forumRes = []
        const forumGet = await db.collection('modules').doc(docId).collection('forums').get()
        i = 0
        len = forumGet.docs.length
        while (i < len) {
            let forum = forumGet.docs[i].data()

            const threadsGet = await db.collection('modules').doc(docId).collection('forums').doc(forumGet.docs[i].id).collection('threads').get()
            let threadsRes = []
            let j = 0, lenThread = threadsGet.docs.length
            while (j < lenThread) {
                let thread = threadsGet.docs[j].data()
                thread = { ...thread, id: threadsGet.docs[j].id }
                threadsRes.push(thread)
                j++
            }

            forum = { ...forum, id: forumGet.docs[i].id, threads: threadsRes }
            forumRes.push(forum)
            i++
        }

        setStudents(studentsRes)
        setProfs(profsRes)
        setPotentialProfs(potProfRef)
        setPotentialStu(potStuRef)
        setForums(typeof forumRes !== 'undefined' ? forumRes : [])
        setLoading(false)
    }
    useEffect(() => {
        fetch()
    }, [])

    const handleAddUser = async (uId) => {

        const currentModRef = db.collection('modules').doc(docId)
        await db.collection('users').doc(uId).collection('modulesRegistered').add({
            init: false,
            module: currentModRef
        })

        setProfModalVisible(false)
        setStuModalVisible(false)
        setSearchTerm('')
        fetch()
    }






    // Other ops
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleSearch = (term) => {
        setSearchTerm(term)
    }

    const tabPanelStyle = {
        borderBottomLeftRadius: '14px',
        borderBottomRightRadius: '14px',
        marginRight: '35px',
        backgroundColor: '#e1e4e8',
        borderTopRightRadius: '14px'
    }

    const modalContentStyle = {
        backgroundColor: '#e1e4e8',
        marginLeft: '8px',
        marginRight: '8px',
    }






    // filtering
    const keysToFilterUsers = ['name', 'nusnet', 'email']
    let filPotStu = []
    let filPotProf = []
    if (searchTerm !== null && searchTerm !== '') {
        filPotStu = potentialStu.filter(createFilter(searchTerm, keysToFilterUsers))
        filPotProf = potentialProfs.filter(createFilter(searchTerm, keysToFilterUsers))
    } else {
        filPotStu = potentialStu
        filPotProf = potentialProfs
    }







    // forum-related
    const handleCreateForum = async () => {
        // null/empty check + trim + save
        if (newForumDetails.title === '' || newForumDetails.description === '') {
            alert('Error: one or more field(s) are empty!')
        } else {
            await db.collection('modules').doc(docId).collection('forums').add(newForumDetails)

            setForumModalVisible(false)
            fetch()
        }
    }

    const handleForumInput = (event, type) => {
        setNewForumDetails({
            ...newForumDetails,
            [type]: event.target.value
        })
    }

    const handleDeleteForum = async (forumId) => {
        await db.collection('modules').doc(docId).collection('forums').doc(forumId).delete()
        fetch()
    }

    const handleEditForum = async (forumId, editDetails) => {
        if (editDetails.title === '' || editDetails.description === '') {
            alert('Error: one or more field(s) are empty!')
        } else {
            await db.collection('modules').doc(docId).collection('forums').doc(forumId).update(editDetails)
            fetch()
        }
    }

    const handleCreateThread = async (forumId, newThreadDetails) => {
        if (newThreadDetails.title === '' || newThreadDetails.description === '' || newThreadDetails.status === '') {
            alert('Error: one or more field(s) are empty!')
        } else {
            await db.collection('modules').doc(docId).collection('forums').doc(forumId).collection('threads').add({ ...newThreadDetails, creatorId: currentUserId })
            fetch()
        }
    }





    return (
        <FullPageWrapper>
            <div style={{ paddingLeft: '35px', paddingTop: '90px' }}>

                <div id="PMVTitle">
                    {"View module"}
                </div>
                <div style={{ width: '1px', height: '60px' }} />
                <ModCode code={details.code} />
                <div style={{ width: '1px', height: '10px' }} />
                <div className="PMVTextBox PMVModTitle">
                    {details.title}
                </div>
                <div className="PMVTextBox PMVModDesc">
                    {details.description}
                </div>
                <div style={{ width: '1px', height: '120px' }} />

                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 0, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="tabs" TabIndicatorProps={{ style: { backgroundColor: '#EF7D00' } }}>
                            <Tab style={{ color: '#1E1E1E', backgroundColor: '#FFF' }} label="Forums" {...a11yProps(0)} />
                            <Tab style={{ color: '#1E1E1E', backgroundColor: '#FFF' }} label="Professors" {...a11yProps(1)} />
                            <Tab style={{ color: '#1E1E1E', backgroundColor: '#FFF' }} label="Students" {...a11yProps(2)} />
                        </Tabs>
                    </Box>

                    <TabPanel value={value} index={0} style={tabPanelStyle}>
                        {isProf && (<Button variant="contained" size="small" startIcon={<PlusIcon size={16} />} onClick={() => setForumModalVisible(true)} >Add a forum</Button>)}

                        <div style={{ width: '1px', height: '60px' }} />

                        {forums.map(e => {
                            return (
                                <ForumTile forum={e} modId={docId} deleteForum={handleDeleteForum} editForum={handleEditForum} createThread={handleCreateThread} />
                            )
                        })}

                        <ReactModal isOpen={forumModalVisible} ariaHideApp>
                            <div className="PMVModalTitle">
                                Add a forum
                            </div>

                            <div>
                                <form>
                                    <Col>
                                        <Row>
                                            <input className="PMVInputText" type="text" placeholder="Title" onChange={(event) => handleForumInput(event, 'title')} value={newForumDetails.title} />
                                        </Row>
                                        <div style={{ width: '100%', height: '10px' }} />
                                        <Row>
                                            <input className="PMVInputText" type="text" placeholder="Description" onChange={(event) => handleForumInput(event, 'description')} value={newForumDetails.description} />
                                        </Row>
                                    </Col>
                                </form>
                            </div>
                            <div style={{ width: '100%', height: '60px' }} />

                            <Button variant="contained" size="small" startIcon={<PlusIcon size={16} />} onClick={handleCreateForum} >Create forum</Button>
                            <Button variant="outlined" size="small" startIcon={<XIcon size={16} />} onClick={() => setForumModalVisible(false)} >Cancel</Button>
                        </ReactModal>

                    </TabPanel>

                    <TabPanel value={value} index={1} style={tabPanelStyle}>
                        {isProf && (<Button variant="contained" size="small" startIcon={<PlusIcon size={16} />} onClick={() => setProfModalVisible(true)} >Add a professor</Button>)}
                        <ProfList list={profs} />

                        <ReactModal isOpen={profModalVisible} ariaHideApp>
                            <div className="PMVModalTitle">
                                Add a professor
                            </div>

                            <div style={{ ...modalContentStyle, borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                                <SearchInput id="PMVSearchBox" fuzzy value={searchTerm} onChange={handleSearch} placeholder={"Search for professors"} />
                            </div>
                            <div style={{ ...modalContentStyle, padding: '26px', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                                {filPotProf.map(e => (
                                    <ProfileTile nusnet={e.nusnet} name={e.name} email={e.email} isProf isAdd overrideFunc={() => handleAddUser(e.id)} />
                                ))}
                            </div>
                            <div style={{ width: '100%', height: '60px' }} />

                            <Button variant="outlined" size="small" startIcon={<XIcon size={16} />} onClick={() => setProfModalVisible(false)} >Cancel</Button>
                        </ReactModal>

                    </TabPanel>

                    <TabPanel value={value} index={2} style={tabPanelStyle}>
                        {isProf && (<Button variant="contained" size="small" startIcon={<PlusIcon size={16} />} onClick={() => setStuModalVisible(true)} >Add a student</Button>)}
                        <StudentList list={students} />

                        <ReactModal isOpen={stuModalVisible} ariaHideApp>
                            <div className="PMVModalTitle">
                                Add a student
                            </div>

                            <div style={{ ...modalContentStyle, borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                                <SearchInput id="PMVSearchBox" fuzzy value={searchTerm} onChange={handleSearch} placeholder={"Search for students"} />
                            </div>
                            <div style={{ ...modalContentStyle, padding: '26px', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                                {filPotStu.map(e => (
                                    <ProfileTile nusnet={e.nusnet} name={e.name} email={e.email} isAdd overrideFunc={() => handleAddUser(e.id)} />
                                ))}
                            </div>
                            <div style={{ width: '100%', height: '60px' }} />

                            <Button variant="outlined" size="small" startIcon={<XIcon size={16} />} onClick={() => setStuModalVisible(false)} >Cancel</Button>
                        </ReactModal>

                    </TabPanel>
                </Box>
                {isLoading && (
                    <div style={{ marginLeft: '35px' }}>
                        <CircularProgress />
                    </div>
                )}
                <div style={{ width: '1px', height: '50px' }} />
            </div>

        </FullPageWrapper>
    )
}

export default PModuleView
