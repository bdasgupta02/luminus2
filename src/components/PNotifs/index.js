import React, { useState, useEffect } from 'react'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import FullPageWrapper from '../FullPageWrapper'
import './notifs.css'


// Page to show threads that this user has created, where there are new messages
function PNotifs() {
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

        let threadList = []
        const threadGet = await db.collectionGroup('threads').get()
        for (let i = 0; i < threadGet.docs.length; i++) {
            db.collectionGroup('threads').doc(threadGet.docs[i].id).get().then((res) => {
                console.log(res)
            })
        }

        // let threadList = []
        // const moduleGet = await db.collection('modules').get()
        // for (let i = 0; i < moduleGet.docs.length; i++) {
        //     const threadGet = await db.collection('modules').doc(moduleGet.docs[i].id).collection('threads').get()
        //     console.log(moduleGet.docs[i].id)
        //     for (let j = 0; j < threadGet.docs.length; j++) {
        //         let t = threadGet.docs[i].data()
        //         console.log(t)
        //         if (threadGet.docs[j].data().creatorId === currentUserId) {
        //             const postGet = await db.collection('modules').doc(threadGet.docs[j].id).collection('posts').get()
        //             let newPosts = 0
        //             postGet.docs.sort((a, b) => b.data().date.seconds < a.data().date.seconds ? 1 : -1)
        //             for (let k = 0; k < postGet.docs.length; k++) {
        //                 const post = postGet.docs[j].data()
        //                 if (post.creatorId === currentUserId) {
        //                     newPosts = 0
        //                 } else {
        //                     newPosts++
        //                 }
        //             }
        //             if (newPosts > 0) {
        //                 t = { ...t, newPosts: newPosts }
        //                 threadList.push(t)
        //             }
        //         }
        //     }
        // }
        // console.log(threadList)
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
            </div>
        </FullPageWrapper>
    )
}

export default PNotifs
