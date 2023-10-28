//imports from react modules
import { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

//imports from local files
import { Login, Recommendations, LandingPage, Steps, Error } from './pages';
import { accessToken } from './spotify';
import './App.css';

// Scroll to top of page when changing routes
/** The following code, until the end comment, is from the React Router Documentation, 'Scroll to top'
Available at: https://v5.reactrouter.com/web/guides/scroll-restoration **/
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
} /** end of citation **/

function App() {
  // check token on every reload
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
  }, []); 

  return (
    <div className="App">
      <header className="App-header">
          <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/steps" element={<Steps />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<LandingPage />} />
            <Route path='*' element={<Error/>}/>
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
