import React from 'react'
import { Button } from '@mui/material'

const NewButton = (props) => {
    let overrideStyle = {
        fontWeight: "bold",
        borderRadius: '6px',
        marginLeft: '7px',
        marginBottom: '7px'
    }
    if (props.variant === 'contained') {
        overrideStyle = { ...overrideStyle, backgroundColor: '#EF7D00' }
    } else {
        overrideStyle = { ...overrideStyle, borderColor: '#EF7D00', color: '#EF7D00' }
    }

    return (
        <Button {...props} style={{...props.style, ...overrideStyle}} />
    )
}

export default NewButton
