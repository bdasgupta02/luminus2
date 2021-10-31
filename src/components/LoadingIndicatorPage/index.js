import { CircularProgress } from '@mui/material'
import './loadingIndicator.css'

const LoadingIndicator = (props) => {
    return (
        <div id="LoadingFullPage">
            <CircularProgress />
        </div>
    )
}

export default LoadingIndicator