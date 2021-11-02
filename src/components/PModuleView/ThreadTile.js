import React from 'react'
import { useHistory } from 'react-router-dom'
import { Card, CardContent, CardActions } from '@mui/material'
import { Row, Col } from 'react-grid-system'
import Button from '../Button'
import ModCode from '../ModCode'
import './pModuleView.css'

// ModCode for status
function ThreadTile(props) {
    const { thread, modId, forumId } = props
    const history = useHistory()

    const handleButton = () => {
        // history push with doc id, forum id and thread id
        history.push("/view_module/view_thread", { threadId: thread.id, modId: modId, forumId: forumId })
    }

    return (
        <div style={{ marginTop: '16px' }}>
            <Card className="PMVCard">
                <CardContent>
                    <Col style={{ marginLeft: '16px' }}>
                        <Row className="PMVCardText" style={{ justifyContent: 'flex-end', width: '100%' }}><ModCode code={"Status: " + thread.status} /></Row>
                        <Row className="PMVCardText" style={{ fontWeight: "bold" }}>{thread.title}</Row>
                        <Row className="PMVCardText">{thread.description}</Row>
                    </Col>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={handleButton}>View thread</Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default ThreadTile
