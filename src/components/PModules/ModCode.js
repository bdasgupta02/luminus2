import React from 'react'

function ModCode(props) {
    const { code } = props

    const codeStyle = {
        borderRadius: '6px',
        color: '#6A6A6A',
        backgroundColor: '#DCDCDC',
        paddingLeft: '8px',
        paddingRight: '8px',
        fontWeight: 'bold'
    }

    return (
        <div style={codeStyle}>
            {code}
        </div>
    )
}

export default ModCode
