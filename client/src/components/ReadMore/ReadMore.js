/* The following code is from TimeToProgram.com (2023), 'Read More Read Less Button in React JS',
Available at: https://timetoprogram.com/read-more-read-less-button-react-js/?utm_content=cmp-true (Accessed 02. August 2023).

Modified to use text + icon instead of a button to trigger the appearance of more information*/

import "./ReadMore.css";
import { useState } from "react";
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";

function ReadMore() {
  const [isShowMore, setIsShowMore] = useState(false);

  const toggleReadMoreLess = () => {
    setIsShowMore(!isShowMore);
  };

  const moreInfo = () => {
    if (isShowMore) {
      return (
        <div>
          <p>
            This project does not store any of your Spotify data. We use this
            access to get your top tracks and add songs from our recommendations
            to your "liked songs" (but only if you tell us you want to save a track!).
          </p>
          <p>
            When you sign in with your account, it creates a unique access code.
            This code is valid for one hour and only refreshes when you use our
            app. To remove the link between your Spotify account and this
            project completely, click 'Remove access' for 'tunec' in Spotify's{" "}
            <a
              href="https://support.spotify.com/us/article/spotify-on-other-apps/"
              target="_blank"
              rel="noreferrer" 
            >
              manage apps
            </a>{" "}
            setting.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="readmore">
      <p>
        This will allow us to access your top tracks and add recommended songs to your library if you prompt us to do so. 
        We won't change anything else. You can remove our access at any time in your Spotify settings.
      </p>
      <p className="readmore__interactiveField" onClick={toggleReadMoreLess}>
        {isShowMore ? "Show less information" : "Get more information"}
        {isShowMore ? (
          <PiCaretUpBold size={16} style={{ marginTop: "2px" }} />
        ) : (
          <PiCaretDownBold size={16} style={{ marginTop: "2px" }} />
        )}
      </p>
      {moreInfo()}
    </div>
  );
}

export default ReadMore;
