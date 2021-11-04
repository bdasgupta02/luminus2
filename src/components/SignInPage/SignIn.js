import { useCallback, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Container, Row, Col } from 'react-grid-system'
import { useHistory } from 'react-router-dom'
import { Button } from '@mui/material'
import { CircularProgress } from '@mui/material'
import './signInPage.css'

const SignIn = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory()
    const [nusnet, setNusnet] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState('')
    const { signin, signout } = useAuth()

    const handleNusnetChange = (event) => {
        setNusnet(event.target.value)
        setError('')
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
        setError('')
    }

    const onSignIn = useCallback(async event => {
        event.preventDefault()
        setIsLoading(true)
        if (nusnet === '') {
            setError('Error: NUSNET is empty!')
            setIsLoading(false)
        } else if (password === '') {
            setError('Error: Password is empty!')
            setIsLoading(false)
        } else {
            try {
                console.log(nusnet)
                console.log(password)
                const response = await signin(nusnet, password)
                if (response !== null) {
                    history.push("/")
                    setIsLoading(false)
                }  else {
                    setError('Error: NUSNET does not exist!')
                    setIsLoading(false)
                }
            } catch (e) {
                if (e.message.includes('user-not-found')) {
                    setError('Sign-in failed: Email does not exist!')
                } else if (e.message.includes('invalid-email')) {
                    setError('Sign in failed: Email format is wrong!')
                } else if (e.message.includes('wrong-password')) {
                    setError('Sign in failed: Incorrect password!')
                } else {
                    setError('Sign in failed')
                }
                setIsLoading(false)
            }
        }
    })

    return (
        <form onSubmit={() => onSignIn(nusnet, password)} className="SignInFullWidth">
            <Container id="SignInFormat">
                <Row id="SignInTitleText">
                    Sign-in
                </Row>
                <Row>
                    <input className="SignInInputText" type="text" placeholder="NUSNET" onChange={handleNusnetChange} value={nusnet} />
                </Row>
                <div className="SignInSpacer" />
                <Row>
                    <input className="SignInInputText" type="password" placeholder="Password" onChange={handlePasswordChange} value={password} />
                </Row>

                <div className="SignInSpacerBig" />
                <Button variant="contained" style={{ width: '150px' }} onClick={onSignIn}>Sign-in</Button>
                {error !== '' ? (<Row id="SignInErrorText">{error}</Row>) : null}
                {isLoading ? <CircularProgress /> : null}
                <div className="SignInSpacerBig" />

            </Container>
        </form>
    )
}

export default SignIn
