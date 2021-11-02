import React from 'react'
import './luminusLogo.css'

function LuminusLogo({ isInvert }) {
    const colorStyle = {
        color: typeof isInvert === 'undefined' || isInvert !== true ? 'black' : 'white'
    }

    return (
        <div id="LLBarLogoText">
            <span style={colorStyle}>Lumi</span>
            <span className="LLBarLogoMid" style={colorStyle}>NUS</span>
            <span style={colorStyle}>&nbsp;2.0</span>
        </div>
    )
}

export default LuminusLogo
