import "./TopTracks.css";

const TopTracks = ({ activeRange, setActiveRange, topTracks, handleTrackClick }) => {
  return (
    <div className="toptracks">
      <h3>Your most played tracks</h3>
      
      {/* Three Buttons to choose the activeRange of the top tracks (last month, 6 months, all time) */}
      <button
            className={activeRange === "short" ? "button--S" : "button-secondary--S"}
            onClick={() => setActiveRange("short")}>
            This Month
      </button>

      <button
            className={activeRange === "medium" ? "button--S" : "button-secondary--S"}
            onClick={() => setActiveRange("medium")}>
            Last 6 Months
      </button>

      <button
            className={activeRange === "long" ? "button--S" : "button-secondary--S"}
            onClick={() => setActiveRange("long")}>
            All Time
        </button>

      <div className="toptracks__scroll-container">
        {!topTracks ? ( /* If the toptracks haven't been fetched yet, display the following */
          <div className="toptracks__loader">
            <p className="p-grey">Loading your most played tracks, please wait...</p>
            <p className="p-grey" style={{marginTop: '16px'}}>If the songs don't appear after a few seconds, please message me. Something doesn't seem to work!</p>
          </div>
        ) : ( /* Otherwise, display the top tracks */
          topTracks.items.map((track, i) => (
            <div
              className={"toptracks__track"}
              key={track.id}
              onClick={() => handleTrackClick(track)}
            >
              <p className="toptracks__track-number">{i + 1}</p>
              <p className="toptracks__track-title">{track.name}</p>
              <p className="toptracks__track-artist">{track.artists[0].name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopTracks;
