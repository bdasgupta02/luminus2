import React from 'react'
import { useHistory } from 'react-router-dom'
import { Card, CardContent, CardActions } from '@mui/material'
import { Row, Col } from 'react-grid-system'
import Button from '../Button'
import ModCode from '../ModCode'

import './pModuleView.css'

function ProfileTile(props) {
    const { id, name, nusnet, email, isProf, overrideFunc, isAdd } = props
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
        history.push("/view_profile", { docId: id })
    }

    const getLeadingText = () => {
        if (typeof isAdd !== 'undefined' && isAdd !== null && isAdd === true) {
            return 'Add'
        } else {
            return 'View'
        }
    }

    return (
        <div style={{marginTop: '16px'}}>
            <Card className="PMVCard">
                <CardContent>
                    <Col style={{ marginLeft: '16px' }}>
                        <Row className="PMVCardText" style={{ justifyContent: 'flex-end', width: '100%' }}><ModCode code={"NUSNET: " + nusnet} /></Row>
                        <Row className="PMVCardText" style={{ fontWeight: "bold" }}>{name}</Row>
                        <Row className="PMVCardText">{email}</Row>
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
