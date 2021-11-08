import React from 'react'
import { useHistory } from 'react-router'
import { Card, CardContent, CardActions } from '@mui/material'
import { Row, Col } from 'react-grid-system'
import Button from '../Button'
import ModCode from '../ModCode'
import './notifs.css'

function NotifTile(props) {
    const history = useHistory()
    const { thread } = props

    const handleButton = () => {
        history.push("/view_module/view_thread", { threadId: thread.id, modId: thread.modId, forumId: thread.forumId })
    }

    const newPostStr = thread.newPosts === 1 ? " new post" : " new posts"
    return (
        <div style={{ marginTop: '16px' }}>
            <Card className="NotifCard">
                <CardContent>
                    <Col style={{ marginLeft: '16px' }}>
                        <Row className="NotifardText" style={{ justifyContent: 'flex-end', width: '100%' }}><ModCode code={"Status: " + thread.status} /></Row>
                        <Row className="NotifCardText" style={{ fontWeight: "bold" }}>{thread.title}</Row>
                        <Row className="NotifardText">{thread.newPosts + newPostStr}</Row>
                    </Col>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={handleButton}>View thread</Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default NotifTile
