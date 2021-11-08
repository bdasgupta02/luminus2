
import React, { useEffect, useState, useContext } from "react";
import LoadingIndicator from "../components/LoadingIndicatorPage";
import { auth, db } from "../firebase";

import "firebase/auth";

export const AuthContext = React.createContext();
export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [currentUserName, setCurrentUserName] = useState(null)
    const [currentUser, setCurrentUser] = useState(null);
    const [isSignedIn, setIsSignedIn] = useState(false)
    const [isProf, setIsProf] = useState(false)
    const [pending, setPending] = useState(true);

    const signup = async (email, password, details) => {
        // nusnet check
        const usersRef = db.collection('users')
        const usersEmail = await usersRef.where('nusnet', '==', details.nusnet).get()

        let check = true;
        usersEmail.docs.forEach(item => {
            if (item.data().nusnet === details.nusnet) {
                check = false;
            }
        })

        if (!check) {
            return null
        }

        // create user
        const user = auth.createUserWithEmailAndPassword(email, password).then((res) => {
            setCurrentUserName(details.name)
            setIsProf(details.isProf)
            db.collection('users').doc(res.user.uid).set(details)
            db.collection('users').doc(res.user.uid).collection('modulesRegistered').doc('init').set({init: true})
        })
        return user
    }

    const signin = async (nusnet, password) => {
        // get email
        const usersRef = db.collection('users')
        const usersEmail = await usersRef.where('nusnet', '==', nusnet).get()
        let check = false;
        let email = ''
        let isBlocked = false
        usersEmail.docs.forEach(item => {
            if (item.data().isBlocked) {
                alert('You\'re blocked!')
                return null
            }

            if (item.data().nusnet === nusnet) {
                check = true;
                email = item.data().email
                isBlocked = item.data().isBlocked
                setCurrentUserName(item.data().name)
                setIsProf(item.data().isProf)
            }
        })

        if (!check || email === '') {
            return null
        }

        if (isBlocked) {
            return null
        }

        // signin
        return auth.signInWithEmailAndPassword(email, password)
    }

    function signout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    useEffect(() => {
        signout()
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setPending(false)
            setCurrentUser(user)
            setIsSignedIn(typeof user !== undefined && user !== null)
        });
        return unsubscribe
    }, []);

    if (pending) {
        return <LoadingIndicator />
    }

    const value = {
        isSignedIn,
        currentUser,
        currentUserId: currentUser === null ? null : currentUser.multiFactor.user.uid,
        isProf,
        currentUserName,
        signup,
        signin,
        signout,
        resetPassword,
        updateEmail,
        updatePassword
    }

    return (
        <AuthContext.Provider
            value={value}
        >
            {!pending && children}
        </AuthContext.Provider>
    );
};

