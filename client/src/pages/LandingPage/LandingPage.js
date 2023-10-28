import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components';

import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const navigateToLogin = () => {
      // navigate to /steps
      navigate('/login');
    };

    return (
    <div className="landingpage">
    <Logo />
    <div className="landingpage__box">
    <h1 className="landingpage__h-color">Discover new music</h1> 
    <h1>by filtering for what you actually want.</h1>
    <p>Select songs from your Spotify library, set a few more preferences – and receive song recommendations based on your selection.</p>
    <button className="button--L" onClick={navigateToLogin}>Get Started</button>
    </div>
    </div>
    );
};

export default LandingPage;