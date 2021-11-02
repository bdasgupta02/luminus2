import React, { useState, useEffect } from 'react'
import { PlusIcon, XIcon, PencilIcon, CheckIcon } from '@primer/octicons-react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext';
import ThreadStatus from '../../enum/ThreadStatus'
import { Row, Col } from 'react-grid-system'
import ThreadTile from './ThreadTile';
import ReactModal from 'react-modal'
import { db } from '../../firebase'
import Button from '../Button'
import './pModuleView.css'

function ForumTile(props) {
    const { modId, forum, editForum, deleteForum, createThread } = props
    const threads = forum.threads

    const { isProf, currentUserId } = useAuth()
    const [confrimDeleteVisible, setConfirmDeleteVisible] = useState(false)
    const [editForumVisible, setEditForumVisible] = useState(false)
    const [addThreadVisible, setAddThreadVisible] = useState(false)
    const [newThreadDetails, setNewThreadDetails] = useState({
        title: '',
        description: '',
        status: '',
        creatorId: currentUserId
    })
    const [editDetails, setEditDetails] = useState({
        title: forum.title,
        description: forum.description
    })









    // Create a thread logic
    // use drop down list for status (but with only the first 2 initial values)
    const handleNewThreadInput = (event, type) => {
        setNewThreadDetails({
            ...newThreadDetails,
            [type]: event.target.value
        })
    }

    const handleNewThreadStatus = (event) => {
        setNewThreadDetails({
            ...newThreadDetails,
            status: event.target.value
        })
    }

    const handleCreateThread = async () => {
        createThread(forum.id, newThreadDetails)
        setAddThreadVisible(false)
        setNewThreadDetails({
            title: '',
            description: '',
            status: '',
            creatorId: currentUserId
        })
    }







    // edit forum
    const handleEditForum = (event, type) => {
        setEditDetails({
            ...editDetails,
            [type]: event.target.value
        })
    }

    const handleEditConfirm = () => {
        editForum(forum.id, editDetails)
        setEditForumVisible(false)
    }







    // delete forum
    const handleDeleteForum = async () => {
        // delete posts
        // delete threads
        // delete forums


        deleteForum(forum.id)
        setConfirmDeleteVisible(false)
    }








    // styles
    const statusStyle = {
        width: '410px',
        marginLeft: '5px',
        borderRadius: '8px'
    }







    return (
        <div id="PMVForumTileBox" style={{ paddingBottom: '16px' }}>
            <div style={{ width: '100%', height: '16px' }} />
            <div className="PMVForumText" style={{ fontWeight: 'bold' }}>
                {forum.title}
            </div>
            <div className="PMVForumText">
                {forum.description}
            </div>

            <div style={{ marginTop: '16px', marginLeft: '10px' }}>
                <Button variant="contained" size="small" startIcon={<PlusIcon size={16} />} onClick={() => setAddThreadVisible(true)} >Add thread</Button>
                {isProf && (<Button variant="outlined" size="small" startIcon={<PencilIcon size={16} />} onClick={() => setEditForumVisible(true)} >Edit forum</Button>)}
                {isProf && (<Button variant="outlined" size="small" startIcon={<XIcon size={16} />} onClick={() => setConfirmDeleteVisible(true)} >Delete forum</Button>)}
            </div>

            <div style={{ marginLeft: '16px' }}>
                {threads.map(e => (
                    <ThreadTile thread={e} modId={modId} forumId={forum.id} />
                ))}
            </div>

            <ReactModal isOpen={addThreadVisible} ariaHideApp>
                <div className="PMVModalTitle">
                    Add a thread
                </div>

                <div>
                    <form>
                        <Col>
                            <Row>
                                <input className="PMVInputText" type="text" placeholder="Title" onChange={(event) => handleNewThreadInput(event, 'title')} value={newThreadDetails.title} />
                            </Row>
                            <div className="PModInputSpacer" />
                            <Row>
                                <input className="PMVInputText" type="text" placeholder="Description" onChange={(event) => handleNewThreadInput(event, 'description')} value={newThreadDetails.description} />
                            </Row>
                            <div className="PModInputSpacer" />
                            <FormControl fullwdith>
                                <InputLabel>Initial status</InputLabel>
                                <Select value={newThreadDetails.status} onChange={handleNewThreadStatus} label="Initial status" style={statusStyle}>
                                    <MenuItem value={ThreadStatus.idea}>Idea</MenuItem>
                                    <MenuItem value={ThreadStatus.issue}>Issue</MenuItem>
                                </Select>
                            </FormControl>
                        </Col>
                    </form>
                </div>
                <div style={{ width: '100%', height: '60px' }} />

                <Button variant="contained" size="small" startIcon={<PlusIcon size={16} />} onClick={handleCreateThread} >Create thread</Button>
                <Button variant="outlined" size="small" startIcon={<XIcon size={16} />} onClick={() => setAddThreadVisible(false)} >Cancel</Button>
            </ReactModal>

            <ReactModal isOpen={editForumVisible} ariaHideApp>
                <div className="PMVModalTitle">
                    Edit forum
                </div>

                <div>
                    <form>
                        <Col>
                            <Row>
                                <input className="PMVInputText" type="text" placeholder="Title" onChange={(event) => handleEditForum(event, 'title')} value={editDetails.title} />
                            </Row>
                            <div className="PModInputSpacer" />
                            <Row>
                                <input className="PMVInputText" type="text" placeholder="Description" onChange={(event) => handleEditForum(event, 'description')} value={editDetails.description} />
                            </Row>
                        </Col>
                    </form>
                </div>
                <div style={{ width: '100%', height: '60px' }} />

                <Button variant="contained" size="small" startIcon={<PencilIcon size={16} />} onClick={handleEditConfirm} >Confirm changes</Button>
                <Button variant="outlined" size="small" startIcon={<XIcon size={16} />} onClick={() => setEditForumVisible(false)} >Cancel</Button>
            </ReactModal>

            <ReactModal isOpen={confrimDeleteVisible} ariaHideApp>
                <div className="PMVModalTitle">
                    Delete forum
                </div>
                <Button variant="contained" size="small" startIcon={<CheckIcon size={16} />} onClick={handleDeleteForum} >Confirm deletion</Button>
                <Button variant="outlined" size="small" startIcon={<XIcon size={16} />} onClick={() => setConfirmDeleteVisible(false)} >Cancel</Button>
            </ReactModal>

        </div>
    )
}

export default ForumTile
