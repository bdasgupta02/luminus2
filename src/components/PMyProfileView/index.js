import React, { useState, useEffect } from 'react'
import FullPageWrapper from '../FullPageWrapper';
import { Row, Col } from 'react-grid-system';
import { useLocation, useHistory } from 'react-router-dom'
import { PencilIcon, ShieldLockIcon, XIcon } from '@primer/octicons-react';
import ReactModal from 'react-modal';
import ModCode from '../ModCode';
import Button from '../Button'
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import './pMyProfileView.css'

function PMyProfileView() {
    const { currentUserId, isProf, updatePassword } = useAuth()
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [changePwModal, setChangePwModal] = useState(false)
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        nusnet: '',
        password: '',
        isBlocked: false,
    })
    const [confirmPassword, setConfirmPassword] = useState('')
    const [editUserDetails, setEditUserDetails] = useState({
        name: '',
        email: '',
        nusnet: '',
        password: '',
    })

    const fetch = async () => {

        const userRef = db.collection('users').doc(currentUserId)
        const userGet = await userRef.get()
        const userData = userGet.data()

        userData.password = ''
        setUserDetails(userData)
        setEditUserDetails(userData)
    }

    useEffect(() => {
        fetch()
    }, [])




    // Edit profile ops
    const isEmail = (email) => {
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email)) {
            return false
        } else {
            return true
        }
    }

    const handleEditInput = (event, type) => {
        setEditUserDetails({
            ...editUserDetails,
            [type]: event.target.value
        })
    }

    const handleConfirmPasswordInput = (event) => {
        setConfirmPassword(event.target.value)
    }

    const handleEditProfile = async () => {
        if (editUserDetails.name === '' || editUserDetails.email === '' || editUserDetails.nusnet === '') {
            alert('Error! One or more value(s) are missing!')
            setEditModalVisible(false)
        } else if (!isEmail(editUserDetails.email)) {
            alert('Error! Email has an incorrect format!')
            setEditModalVisible(false)
        } else {
            await db.collection('users').doc(currentUserId).update({
                name: editUserDetails.name,
                email: editUserDetails.email,
                nusnet: editUserDetails.nusnet
            })
            setEditModalVisible(false)
            fetch()
        }
    }

    const handlePasswordChange = async () => {
        if (editUserDetails.password === '' || confirmPassword === '') {
            alert('Error! One or more value(s) are missing!')
            setChangePwModal(false)
        } else if (editUserDetails.password !== confirmPassword) {
            alert('Error! Passwords don\'t match!')
            setChangePwModal(false)
        } else {
            updatePassword(editUserDetails.password)
            await db.collection('users').doc(currentUserId).update({
                password: editUserDetails.password
            })
            setChangePwModal(false)
            fetch()
        }
    }




    return (
        <FullPageWrapper>
            <div style={{ paddingLeft: '35px', paddingTop: '90px' }}>
                <div id="PPVTitle">
                    {"My profile"}
                </div>

                <div style={{ width: '1px', height: '60px' }} />
                {isProf === false && (<ModCode code={userDetails.isBlocked ? "Blocked" : "Not blocked"} />)}
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

                <div style={{ width: '100%' }}>
                    <Button variant="contained" size="small" startIcon={<PencilIcon size={16} />} onClick={() => setEditModalVisible(true)} >Edit your profile</Button>
                </div>
                <div style={{ width: '100%' }}>
                    <Button variant="outlined" size="small" startIcon={<ShieldLockIcon size={16} />} onClick={() => setChangePwModal(true)} >Change password</Button>
                </div>
            </div>

            <ReactModal isOpen={editModalVisible} ariaHideApp>
                <div className="PMPModalTitle">
                    Edit profile
                </div>

                <div>
                    <form>
                        <Col>
                            <div className="PMPLabel">Name</div>
                            <Row>
                                <input className="PMPInputText" type="text" placeholder="Name" onChange={(event) => handleEditInput(event, 'name')} value={editUserDetails.name} />
                            </Row>
                            <div style={{ width: '100%', height: '10px' }} />
                            <div className="PMPLabel">Email</div>
                            <Row>
                                <input className="PMPInputText" type="text" placeholder="Email" onChange={(event) => handleEditInput(event, 'email')} value={editUserDetails.email} />
                            </Row>
                            <div style={{ width: '100%', height: '10px' }} />
                            <div className="PMPLabel">NUSNET</div>
                            <Row>
                                <input className="PMPInputText" type="text" placeholder="NUSNET" onChange={(event) => handleEditInput(event, 'nusnet')} value={editUserDetails.nusnet} />
                            </Row>
                        </Col>
                    </form>
                </div>
                <div style={{ width: '100%', height: '50px' }} />

                <Button variant="contained" size="small" startIcon={<PencilIcon size={16} />} onClick={handleEditProfile} >Edit profile</Button>
                <Button variant="outlined" size="small" startIcon={<XIcon size={16} />} onClick={() => setEditModalVisible(false)} >Cancel</Button>

            </ReactModal>

            <ReactModal isOpen={changePwModal} ariaHideApp>
                <div className="PMPModalTitle">
                    Change password
                </div>

                <div>
                    <form>
                        <Col>
                            <div className="PMPLabel">Password</div>
                            <Row>
                                <input className="PMPInputText" type="text" placeholder="Password" onChange={(event) => handleEditInput(event, 'password')} value={editUserDetails.password} />
                            </Row>
                            <div style={{ width: '100%', height: '10px' }} />
                            <div className="PMPLabel">Confirm password</div>
                            <Row>
                                <input className="PMPInputText" type="text" placeholder="Confirm password" onChange={handleConfirmPasswordInput} value={confirmPassword} />
                            </Row>
                        </Col>
                    </form>
                </div>
                <div style={{ width: '100%', height: '50px' }} />

                <Button variant="contained" size="small" startIcon={<PencilIcon size={16} />} onClick={handlePasswordChange} >Change password</Button>
                <Button variant="outlined" size="small" startIcon={<XIcon size={16} />} onClick={() => setChangePwModal(false)} >Cancel</Button>

            </ReactModal>

        </FullPageWrapper>
    )
}

export default PMyProfileView
