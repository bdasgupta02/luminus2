import React from 'react'

function FullPageWrapper(props) {

    return (
        <div style={{minHeight: '100vh', minWidth: '100%', backgroundColor: '#F2F6FE', ...props.style}}>
            {props.children}
        </div>
    )
}

export default FullPageWrapper
