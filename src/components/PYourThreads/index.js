import React, { useState, useEffect } from 'react'
import FullPageWrapper from '../FullPageWrapper'
import ThreadTile from '../PModuleView/ThreadTile'
import { db } from '../../firebase'
import { CircularProgress } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import './pYourThreads.css'

function YourThreads() {
    const { currentUserId } = useAuth()
    const [isLoading, setLoading] = useState(false)
    const [threads, setThreads] = useState([])

    const fetch = async () => {
        let threadList = []
        setLoading(true)
        const moduleGet = await db.collection('modules').get()
        for (let i = 0; i < moduleGet.docs.length; i++) {
            const forumGet = await db.collection('modules').doc(moduleGet.docs[i].id).collection('forums').get()
            for (let j = 0; j < forumGet.docs.length; j++) {
                const threadGet = await db.collection('modules').doc(moduleGet.docs[i].id).collection('forums').doc(forumGet.docs[j].id).collection('threads').get()
                for (let k = 0; k < threadGet.docs.length; k++) {
                    let t = threadGet.docs[k].data()
                    t = { ...t, id: threadGet.docs[k].id, modId: moduleGet.docs[i].id, forumId: forumGet.docs[j].id }
                    if (t.creatorId === currentUserId) {
                        threadList.push(t)
                    }
                }
            }
        }
        setThreads(threadList)
        setLoading(false)
    }

    useEffect(() => {
        fetch()
    }, [])

    return (
        <FullPageWrapper>
            <div style={{ paddingLeft: '35px', paddingTop: '90px' }}>
                <div id="PYTTitle">
                    Your threads
                </div>
                <div id="PYTSubtitle">
                    All threads you own
                </div>
                <div style={{ width: '100%', height: '60px' }} />
                {threads.map(e => (
                    <ThreadTile thread={e} modId={e.modId} forumId={e.forumId} />
                ))}
                {isLoading && (
                    <div style={{ marginLeft: '35px' }}>
                        <CircularProgress />
                    </div>
                )}
                <div style={{ width: '100%', height: '60px' }} />
            </div>
        </FullPageWrapper>
    )
}

export default YourThreads
