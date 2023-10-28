import { Link } from "react-router-dom";
import './Error.css';

const Error = () => {
    return (
        <div className="error">
            <h2>Oops! This page doesn't exist</h2>
            <Link to='/'>Go back to the start</Link>
        </div>
    )
}

export default Error;