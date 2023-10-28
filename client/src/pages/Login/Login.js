import './Login.css';
import { StepsHeader, ReadMore} from "../../components";

/** The following code, until the 'end of citation' comment, is from a tutorial by Brittany Chiang (2021) on Newline.co, 'Build a Spotify Connected App'.
Available at: https://www.newline.co/courses/build-a-spotify-connected-app **/
const LOGIN_URI =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:8888/login'
    : 'https://tunec-230225951714.herokuapp.com/login';
/** End of Citation **/

const Login = () => {
  return(
    <div className="login">
    <div className='login__header'>
    <StepsHeader step={1}/>
    </div>
    <div className="login__content">
      <h2>Connect your Spotify</h2>
      <ReadMore />
      <a href={LOGIN_URI}>
    <button className="button--M">
            Connect now
          </button>
          </a>
    </div>
    </div>
    )
};


export default Login;