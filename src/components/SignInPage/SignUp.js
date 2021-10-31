import { useCallback, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Container, Row, Col } from 'react-grid-system'
import { useHistory } from 'react-router-dom'
import { Button } from '@mui/material'
import { Stack, Switch, Typography, CircularProgress } from '@mui/material'
import './signInPage.css'

// TODO: nusnet to email conversion
const SignUp = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [confirmPw, setConfirmPw] = useState('')
    const [error, setError] = useState('')
    const [details, setDetails] = useState({
        email: '',
        password: '',
        nusnet: '',
        isProf: false,
        isDeleted: false,
        isBlocked: false,
    })
    const { signup } = useAuth()
    const history = useHistory()

    const onSignUp = useCallback(async event => {
        event.preventDefault()
        setIsLoading(true)
        if (details.email === '') {
            setError('Error: Email is empty!')
            setIsLoading(false)
        } else if (details.password === '') {
            setError('Error: Password is empty!')
            setIsLoading(false)
        } else if (details.password !== confirmPw) {
            setError('Error: Passwords don\'t match!')
            setIsLoading(false)
        } else if (details.nusnet === '') {
            setError('Error: NUSNET cannot be empty!')
            setIsLoading(false)
        } else {
            try {
                const response = await signup(details.email, details.password, details)
                if (response !== null) {
                    history.push("/")
                    setIsLoading(false)
                } else {
                    setError('Error: NUSNET exists!')
                    setIsLoading(false)
                }
            } catch (e) {
                // TODO: handle error detection
                alert(e)
                setIsLoading(false)
            }
        }
    })

    const handleDetailChange = (event, type) => {
        setDetails({
            ...details,
            [type]: event.target.value
        })
    } 

    const handleProfChange = (event) => {
        setDetails({
            ...details,
            isProf: event.target.checked
        })
    }

    return (
        <form onSubmit={onSignUp} className="SignInFullWidth">
            <Container id="SignInFormat">
                <Row id="SignInTitleText">
                    Sign-up
                </Row>
                <Row>
                    <input className="SignInInputText" type="email" placeholder="Email" value={details.email} onChange={event => handleDetailChange(event, 'email')} />
                </Row>
                <div className="SignInSpacer" />
                <Row>
                    <input className="SignInInputText" type="text" placeholder="NUSNET" value={details.nusnet} onChange={event => handleDetailChange(event, 'nusnet')} />
                </Row>
                <div className="SignInSpacer" />
                <div className="SignInSpacer" />
                <div className="SignInSpacer" />
                <Row>
                    <input className="SignInInputText" type="password" placeholder="Password" value={details.password} onChange={event => handleDetailChange(event, 'password')} />
                </Row>
                <div className="SignInSpacer" />
                <Row>
                    <input className="SignInInputText" type="password" placeholder="Confirm password" value={confirmPw} onChange={event => setConfirmPw(event.target.value)} />
                </Row>
                <div className="SignInSpacer" />
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Student</Typography>
                    <Switch inputProps={{ 'aria-label': 'ant design' }} checked={details.isProf} onChange={event => handleProfChange(event)} />
                    <Typography>Professor</Typography>
                </Stack>

                <div className="SignInSpacerBig" />
                <Button variant="contained" style={{width: '150px'}} onClick={onSignUp}>Sign-up</Button> 
                <div className="SignInSpacer" />
                {error !== '' ? (<Row id="SignInErrorText">{error}</Row>) : null}
                {isLoading ? <CircularProgress /> : null}
                <div className="SignInSpacerBig" />

            </Container>
        </form>
    )
}

export default SignUp
