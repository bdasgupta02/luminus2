import React from 'react'
import { useHistory } from 'react-router-dom'
import { Card, CardContent, CardActions } from '@mui/material'
import { Row, Col } from 'react-grid-system'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../Button'
import ModCode from '../ModCode'

import './profileTile.css'

function ProfileTile(props) {
    const { id, name, nusnet, email, isProf, overrideFunc, isAdd } = props
    const { currentUserId } = useAuth()
    const userStr = isProf ? 'professor' : 'student'
    const history = useHistory()

    const handleButton = () => {
        if (typeof overrideFunc !== 'undefined' && overrideFunc !== null) {
            overrideFunc()
        } else {
            handleViewProfile()
        }
    }

    const handleViewProfile = () => {
        if (id === currentUserId) {
            history.push("/my_profile", { docId: id, profileIsProf: isProf })
        } else {
            history.push("/view_profile", { docId: id, profileIsProf: isProf })
        }
    }

    const getLeadingText = () => {
        if (typeof isAdd !== 'undefined' && isAdd !== null && isAdd === true) {
            return 'Add'
        } else {
            return 'View'
        }
    }

    return (
        <div style={{ marginTop: '16px' }}>
            <Card className="PTCard">
                <CardContent>
                    <Col style={{ marginLeft: '16px' }}>
                        <Row className="PTCardText" style={{ justifyContent: 'flex-end', width: '100%' }}><ModCode code={"NUSNET: " + nusnet} /></Row>
                        <Row className="PTCardText" style={{ fontWeight: "bold" }}>{name}</Row>
                        <Row className="PTCardText">{email}</Row>
                    </Col>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={handleButton}>{getLeadingText()}&nbsp;{userStr}</Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default ProfileTile
