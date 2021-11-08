import React, { useState, useEffect } from 'react'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import FullPageWrapper from '../FullPageWrapper'
import { CircularProgress } from '@mui/material'
import NotifTile from './NotifTile'
import './notifs.css'


// Page to show threads that this user has created, where there are new messages
function PNotifs() {
    const [isLoading, setLoading] = useState(false)
    const [threads, setThreads] = useState([])
    const { currentUserId } = useAuth()

    const fetch = async () => {
        // let threadList = []
        // const threadGet = await db.collectionGroup('threads').get()
        // for (let i = 0; i < threadGet.docs.length; i++) {
        //     let t = threadGet.docs[i].data()
        //     console.log(currentUserId === t.creatorId)
        //     if (t.creatorId === currentUserId) {
        //         let newPosts = 0
        //         const postsGet = await db.collectionGroup('threads').doc(threadGet.docs[i].id).collection('posts').get()
        //         console.log(postsGet)
        //         postsGet.docs.sort((a, b) => b.data().date.seconds < a.data().date.seconds ? 1 : -1)
        //         for (let j = 0; j < postsGet.docs.length; j++) {
        //             const post = postsGet.docs[j].data()
        //             console.log(post)
        //             if (post.creatorId === currentUserId) {
        //                 newPosts = 0
        //             } else {
        //                 newPosts++
        //             }
        //         }
        //         if (newPosts > 0) {
        //             t = { ...t, newPosts: newPosts }
        //             threadList.push(t)
        //         }
        //     }
        // }
        // console.log(threadList)

        // let threadList = []
        // const threadGet = await db.collectionGroup('threads').get()
        // for (let i = 0; i < threadGet.docs.length; i++) {
        //     // db.collectionGroup('threads').doc(threadGet.docs[i].id).get().then((res) => {
        //     //     console.log(res)
        //     // })
        //     console.log(threadGet.docs[i])
        // }

        let threadList = []
        setLoading(true)
        const moduleGet = await db.collection('modules').get()
        for (let i = 0; i < moduleGet.docs.length; i++) {
            const forumGet = await db.collection('modules').doc(moduleGet.docs[i].id).collection('forums').get()
            for (let j = 0; j < forumGet.docs.length; j++) {
                const threadGet = await db.collection('modules').doc(moduleGet.docs[i].id).collection('forums').doc(forumGet.docs[j].id).collection('threads').get()
                for (let k = 0; k < threadGet.docs.length; k++) {
                    let t = threadGet.docs[k].data()
                    if (threadGet.docs[k].data().creatorId === currentUserId) {
                        const postGet = await db.collection('modules').doc(moduleGet.docs[i].id).collection('forums').doc(forumGet.docs[j].id).collection('threads').doc(threadGet.docs[k].id).collection('posts').get()
                        let newPosts = 0
                        postGet.docs.sort((a, b) => b.data().date.seconds < a.data().date.seconds ? 1 : -1)
                        for (let l = 0; l < postGet.docs.length; l++) {
                            const post = postGet.docs[l].data()
                            if (post.creatorId === currentUserId) {
                                newPosts = 0
                            } else {
                                newPosts++
                            }
                        }
                        if (newPosts > 0) {
                            t = { ...t, newPosts: newPosts, modId: moduleGet.docs[i].id, forumId: forumGet.docs[j].id, id: threadGet.docs[k].id }
                            threadList.push(t)
                        }
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
                <div id="NotifsTitle">
                    Notifications
                </div>
                <div id="NotifsSubtitle">
                    New posts on your threads
                </div>
                <div style={{ width: '100%', height: '60px' }} />
                {threads.map(e => (
                    <NotifTile thread={e} />
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

export default PNotifs
