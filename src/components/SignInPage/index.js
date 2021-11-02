import { useState } from "react"
import SignIn from './SignIn'
import SignUp from './SignUp'
import LuminusLogo from '../LuminusLogo'
import './signInPage.css'

/**
 * TODO:
 * - NUSNET check for signing up with firestore
 * - 
 */
const SignInPage = (props) => {
    const [isSignIn, setIsSignIn] = useState(true)

    return (
        <div id="SignInFullPage">
            <div className="SignInSpacerBig" />
            <LuminusLogo />
            <div className="SignInSpacerBig" />
            <div id="SignInBox">
                {isSignIn ? (<SignIn />) : (<SignUp />)}
            </div>
            <div className="SignInSpacerBig" />
            {isSignIn ? (
                <a id="SignInBottomLink" onClick={() => setIsSignIn(!isSignIn)}><span>Don't have an account?</span><span id="SignInBottomLinkBold"> Sign-up here</span></a>
            ) : (
                <a id="SignInBottomLink" onClick={() => setIsSignIn(!isSignIn)}><span>Already have an account?</span><span id="SignInBottomLinkBold"> Sign-in here</span></a>
            )}
            
        </div>
    )
}

export default SignInPage