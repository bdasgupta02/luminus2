import React from 'react'
import ProfileTile from '../ProfileTile'

function ProfList(props) {
    const { list } = props

    return (
        <div>
            {list.map(e => (
                <ProfileTile id={e.id}  name={e.name} nusnet={e.nusnet} email={e.email} isProf />
            ))}
        </div>
    )
}

export default ProfList
