import React, { useState, useEffect } from 'react'
import FullPageWrapper from '../FullPageWrapper'
import { db } from '../../firebase';
import { useLocation } from 'react-router-dom'
import ModCode from '../ModCode';
import { useAuth } from '../../contexts/AuthContext'
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import { Row, Col } from 'react-grid-system';
import ReactModal from 'react-modal';
import { useHistory } from 'react-router';
import Button from '../Button'
import ThreadStatus from '../../enum/ThreadStatus'
import { PlusIcon, XIcon, PencilIcon, TrashIcon } from '@primer/octicons-react';
import firebase from '@firebase/app-compat';
import './pThreadView.css'

function PThreadView(props) {
    // init
    const history = useHistory()
    const { currentUserId, isProf, currentUserName } = useAuth()
    const location = useLocation().state
    const { modId, forumId, threadId } = location

    // thread related
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [statusModalVisible, setStatusModalVisible] = useState(false)
    const [editDetails, setEditDetails] = useState({
        creatorId: '',
        description: '',
        status: '',
        title: '',
    })
    const [thread, setThread] = useState({
        creatorId: '',
        description: '',
        status: '',
        title: '',
    })

    // post related
    const [posts, setPosts] = useState([])
    const [newPostContent, setNewPostContent] = useState('')
    const [editPostModalVisible, setEditPostModalVisible] = useState(false)
    const [editPostContent, setEditPostContent] = useState('')
    const [postToEdit, setPostToEdit] = useState(null)

    // simplified boolean
    const canModify = thread.creatorId === currentUserId || isProf
    const isClosed = thread.status === ThreadStatus.closed || thread.status === ThreadStatus.solved

    // DB
    const fetch = async () => {
        const threadRef = db.collection('modules').doc(modId).collection('forums').doc(forumId).collection('threads').doc(threadId)
        const threadGet = await threadRef.get()
        setThread(threadGet.data())
        setEditDetails(threadGet.data())

        const postsRef = db.collection('modules').doc(modId).collection('forums').doc(forumId).collection('threads').doc(threadId).collection('posts')
        const postsGet = await postsRef.get()
        if (postsGet.docs.length > 0) {
            let i = 0, len = postsGet.docs.length
            let postsRes = []
            while (i < len) {
                let post = postsGet.docs[i].data()
                post = { ...post, id: postsGet.docs[i].id }
                postsRes.push(post)
                i++
            }
            setPosts(postsRes)
        }
    }

    useEffect(() => {
        fetch()
    }, [])


    // ops
    const handleEditThread = async () => {
        if (editDetails.title === '' || editDetails.description === '') {
            alert('Error! One or more value(s) are missing!')
            setEditModalVisible(false)
        } else {
            console.log('test')
            await db.collection('modules').doc(modId).collection('forums').doc(forumId).collection('threads').doc(threadId).update({
                title: editDetails.title,
                description: editDetails.description
            })
            setEditModalVisible(false)
            fetch()
        }
    }

    const handleDeleteThread = async () => {
        await db.collection('modules').doc(modId).collection('forums').doc(forumId).collection('threads').doc(threadId).delete()
        history.push('/view_module', { docId: modId })
    }

    const handleChangeStatus = async () => {
        if (editDetails.status === '') {
            alert('Error! Status is missing!')
            setStatusModalVisible(false)
        } else if (editDetails.status === thread.status) {
            alert('Error! You haven\'t changed the status!')
            setStatusModalVisible(false)
        } else {
            await db.collection('modules').doc(modId).collection('forums').doc(forumId).collection('threads').doc(threadId).update({
                status: editDetails.status
            })
            setStatusModalVisible(false)
            fetch()
        }
    }

    const handleCreatePost = async () => {
        if (newPostContent === '') {
            alert('Error! Post content is missing!')
            setStatusModalVisible(false)
        } else {
            await db.collection('modules').doc(modId).collection('forums').doc(forumId).collection('threads').doc(threadId).collection('posts').add({
                content: newPostContent,
                creatorId: currentUserId,
                name: currentUserName,
                date: firebase.firestore.Timestamp.fromDate(new Date())
            })
            setStatusModalVisible(false)
            setNewPostContent('')
            fetch()
        }
    }

    const handleDeletePost = async (post) => {
        await db.collection('modules').doc(modId).collection('forums').doc(forumId).collection('threads').doc(threadId).collection('posts').doc(post.id).delete()
        fetch()
    }

    const handleEditPost = async () => {
        await db.collection('modules').doc(modId).collection('forums').doc(forumId).collection('threads').doc(threadId).collection('posts').doc(postToEdit.id).update({
            content: editPostContent
        })
        setEditPostContent('')
        setEditPostModalVisible(false)
        setPostToEdit(null)
        fetch()
    }

    const handleEditInput = (event, type) => {
        setEditDetails({
            ...editDetails,
            [type]: event.target.value
        })
    }

    const handleNewThreadStatus = (event) => {
        setEditDetails({
            ...editDetails,
            status: event.target.value
        })
    }

    const handleNewPostInput = (event) => {
        setNewPostContent(event.target.value)
    }

    const handleEditPostOpen = (post) => {
        setEditPostContent(post.content)
        setPostToEdit(post)
        setEditPostModalVisible(true)
    }

    const statusStyle = {
        width: '410px',
        marginLeft: '5px',
        borderRadius: '8px'
    }

    posts.sort((a, b) => b.date.seconds < a.date.seconds ? 1 : -1)
    // title -> details -> buttons (if owner or prof) -> change status (prof) -> list of posts (postTile) -> create post text area with button
    return (
        <FullPageWrapper>
            <div style={{ paddingLeft: '35px', paddingTop: '90px' }}>
                <div id="PTVTitle">
                    View thread
                </div>

                <div style={{ width: '1px', height: '60px' }} />
                <ModCode code={"Status: " + thread.status} />
                <div style={{ width: '1px', height: '10px' }} />
                <div className="PTVTextBox PTVModTitle">
                    {thread.title}
                </div>
                <div className="PTVTextBox PTVModDesc">
                    {thread.description}
                </div>
                <div style={{ width: '1px', height: '120px' }} />

                {isProf && (
                    <div style={{ width: '100%' }}>
                        <Button variant="contained" size="small" startIcon={<PencilIcon size={16} />} onClick={() => setStatusModalVisible(true)} >Change status</Button>
                    </div>
                )}
                {canModify && (
                    <div>
                        <div style={{ width: '100%' }}>
                            <Button variant="contained" size="small" startIcon={<PencilIcon size={16} />} onClick={() => setEditModalVisible(true)} >Edit this thread</Button>
                        </div>
                        <div style={{ width: '100%' }}>
                            <Button variant="outlined" size="small" startIcon={<TrashIcon size={16} />} onClick={() => setDeleteModalVisible(true)} >Delete this thread</Button>
                        </div>
                    </div>
                )}

                <div style={{ width: '1px', height: '60px' }} />

                <div style={{ padding: '8px', backgroundColor: '#e1e4e8', marginRight: '35px', borderRadius: '12px' }}>
                    {posts.map(e => {
                        const canModifyPost = currentUserId === e.creatorId || isProf
                        return (
                            <div style={{ width: '100%', marginTop: '16px', marginBottom: '16px', marginLeft: '7px' }}>
                                <div className="PTVPostBG">
                                    <div className="PTVPostContent">
                                        {e.content}
                                    </div>
                                    <div className="PTVPostName">
                                        {"By " + e.name}
                                    </div>
                                    <div className="PTVPostDate">
                                        {new Date(e.date.seconds * 1000).toDateString()}
                                    </div>
                                    <div style={{ width: '100%', height: '10px' }} />
                                    {canModifyPost && (
                                        <div>
                                            <Button variant="contained" size="small" startIcon={<PencilIcon size={16} />} onClick={() => handleEditPostOpen(e)} >Edit post</Button>
                                            <Button variant="outlined" size="small" startIcon={<TrashIcon size={16} />} onClick={() => handleDeletePost(e)} >Delete post</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}



                    {!isClosed && (
                        <div>
                            <div style={{ width: '1px', height: '30px' }} />
                            <div style={{ width: '100%' }}>
                                <textarea id="PTVInputTextML" value={newPostContent} onChange={handleNewPostInput} cols="40" rows="5" placeholder="Write a new post" />
                            </div>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <Button variant="contained" size="small" startIcon={<PlusIcon size={16} />} onClick={handleCreatePost} >Create post</Button>
                            </div>
                        </div>
                    )}

                </div>

                <div style={{ width: '1px', height: '30px' }} />

                <ReactModal isOpen={editModalVisible} ariaHideApp>
                    <div className="PTVModalTitle">
                        Edit thread
                    </div>

                    <div>
                        <form>
                            <Col>
                                <div className="PTVLabel">Title</div>
                                <Row>
                                    <input className="PTVInputText" type="text" placeholder="Title" onChange={(event) => handleEditInput(event, 'title')} value={editDetails.title} />
                                </Row>
                                <div style={{ width: '100%', height: '10px' }} />
                                <div className="PTVLabel">Description</div>
                                <Row>
                                    <input className="PTVInputText" type="text" placeholder="Description" onChange={(event) => handleEditInput(event, 'description')} value={editDetails.description} />
                                </Row>
                            </Col>
                        </form>
                    </div>
                    <div style={{ width: '100%', height: '50px' }} />

                    <Button variant="contained" size="small" startIcon={<PencilIcon size={16} />} onClick={handleEditThread} >Confirm changes</Button>
                    <Button variant="outlined" size="small" startIcon={<XIcon size={16} />} onClick={() => setEditModalVisible(false)} >Cancel</Button>

                </ReactModal>

                <ReactModal isOpen={deleteModalVisible} ariaHideApp>
                    <div className="PTVModalTitle">
                        Deleting thread. Are you sure?
                    </div>

                    <Button variant="contained" size="small" startIcon={<TrashIcon size={16} />} onClick={handleDeleteThread} >Delete thread</Button>
                    <Button variant="outlined" size="small" startIcon={<XIcon size={16} />} onClick={() => setDeleteModalVisible(false)} >Cancel</Button>

                </ReactModal>

                <ReactModal isOpen={statusModalVisible} ariaHideApp>
                    <div className="PTVModalTitle">
                        Change status
                    </div>

                    <div style={{ width: '100%' }}>
                        <FormControl fullwdith>
                            <InputLabel>Status</InputLabel>
                            <Select value={editDetails.status} onChange={handleNewThreadStatus} label="Initial status" style={statusStyle}>
                                <MenuItem value={ThreadStatus.idea}>Idea</MenuItem>
                                <MenuItem value={ThreadStatus.issue}>Issue</MenuItem>
                                <MenuItem value={ThreadStatus.closed}>Closed</MenuItem>
                                <MenuItem value={ThreadStatus.solved}>Solved</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{ width: '100%', height: '50px' }} />

                    <Button variant="contained" size="small" startIcon={<PencilIcon size={16} />} onClick={handleChangeStatus} >Confirm status</Button>
                    <Button variant="outlined" size="small" startIcon={<XIcon size={16} />} onClick={() => setStatusModalVisible(false)} >Cancel</Button>

                </ReactModal>

                <ReactModal isOpen={editPostModalVisible} ariaHideApp>
                    <div className="PTVModalTitle">
                        Edit post
                    </div>

                    <div>
                        <form>
                            <Col>
                                <div className="PTVLabel">Content</div>
                                <Row>
                                    <textarea id="PTVInputTextML" style={{ backgroundColor: '#ebebeb', marginLeft: '20px' }} cols="40" rows="5" value={newPostContent} type="text" placeholder="Content" onChange={(event) => setEditPostContent(event.target.value)} value={editPostContent} />
                                </Row>
                            </Col>
                        </form>
                    </div>
                    <div style={{ width: '100%', height: '50px' }} />

                    <Button variant="contained" size="small" startIcon={<PencilIcon size={16} />} onClick={handleEditPost} >Confirm changes</Button>
                    <Button variant="outlined" size="small" startIcon={<XIcon size={16} />} onClick={() => setEditPostModalVisible(false)} >Cancel</Button>

                </ReactModal>

            </div>
        </FullPageWrapper>
    )
}

export default PThreadView
