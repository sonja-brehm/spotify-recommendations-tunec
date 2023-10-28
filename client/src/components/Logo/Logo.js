import imgLogo from '../../images/logo.svg';
import { Link } from "react-router-dom";

import './Logo.css';

const Logo = () => {
//Logo positioned in the upper left corner with css + link to the home page when clicked
    return (
    <div className="logo">
        <Link to='/'>
        <img src={imgLogo} alt='Logo' />
         </Link>
    </div>
    );
};

export default Logo;