import React, { useState, useEffect } from 'react'
import FullPageWrapper from '../FullPageWrapper';
import { useLocation, useHistory } from 'react-router-dom'
import { PencilIcon, BlockedIcon } from '@primer/octicons-react';
import ModCode from '../ModCode';
import Button from '../Button'
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import './pProfileView.css'

function PProfileView() {
    let location = {
        docId: null,
        profileIsProf: null
    }
    location = {
        ...location,
        ...useLocation().state
    }
    const { currentUserId, isProf } = useAuth()
    const isOwner = location.docId === null || location.docId === currentUserId
    const history = useHistory()

    const canModerate = location.profileIsProf !== null && location.profileIsProf === false && isProf === true

    const [editModalVisible, setEditModalVisible] = useState(false)
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        nusnet: '',
        password: '',
        isBlocked: false,
    })
    const [editUserPassword, setEditUserPassword] = useState({
        password: '',
        confirmPassword: ''
    })
    const [editUserDetails, setEditUserDetails] = useState({
        name: '',
        email: '',
        nusnet: '',
        password: '',
    })

    const fetch = async () => {

        if (isOwner) {
            console.log('wrong')
            history.push('/my_profile')
        } else {
            let userRef = {}
            let user = {}
            if (isOwner) {
                userRef = db.collection('users').doc(currentUserId)
            } else {
                userRef = db.collection('users').doc(location.docId)
            }

            const userGet = await userRef.get()
            const userData = userGet.data()

            setUserDetails(userData)
            setEditUserDetails(userData)
        }
    }

    useEffect(() => {
        fetch()
    }, [])


    const handleToggleBlock = async () => {
        if (!isOwner) {
            if (userDetails.isBlocked) {
                await db.collection('users').doc(location.docId).update({
                    isBlocked: false
                })
            } else {
                await db.collection('users').doc(location.docId).update({
                    isBlocked: true
                })
            }
        }

        fetch()
    }


    return (
        <FullPageWrapper>
            <div style={{ paddingLeft: '35px', paddingTop: '90px' }}>
                <div id="PPVTitle">
                    {location.docId === null || location.docId === currentUserId ? "My profile" : "View profile"}
                </div>

                <div style={{ width: '1px', height: '60px' }} />
                {location.profileIsProf !== null && location.profileIsProf === false && (<ModCode code={userDetails.isBlocked ? "Blocked" : "Not blocked"} />)}
                <div style={{ width: '1px', height: '10px' }} />
                <div className="PPVTextBox">
                    <span className="PPVBold">Name:&nbsp;</span>
                    <span>{userDetails.name}</span>
                </div>
                <div className="PPVTextBox">
                    <span className="PPVBold">Email:&nbsp;</span>
                    <span>{userDetails.email}</span>
                </div>
                <div className="PPVTextBox">
                    <span className="PPVBold">NUSNET:&nbsp;</span>
                    <span>{userDetails.nusnet}</span>
                </div>
                <div style={{ width: '1px', height: '70px' }} />

                <div>
                    {canModerate && (<Button variant="contained" size="small" startIcon={<BlockedIcon size={16} />} onClick={handleToggleBlock} >{userDetails.isBlocked ? "Unblock" : "Block"}</Button>)}
                </div>
            </div>
        </FullPageWrapper>
    )
}

export default PProfileView
