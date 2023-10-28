/* The code in this file is from a tutorial by Brittany Chiang (2021) on Newline.co, 'Build a Spotify Connected App'.
Available at: https://www.newline.co/courses/build-a-spotify-connected-app

It has been slightly modified to fit the needs of this project, e.g. using different Spotify authorization scopes
*/

require("dotenv").config();
const express = require("express");
const querystring = require("querystring"); //makes handling query params easier, let's us parse and stringify query strings
const axios = require("axios");
const app = express();
const path = require("path");

//load variables from .env
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;
const PORT = process.env.PORT || 8888;

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, "./client/build")));

//display "Hello" on the homepage
app.get("/", (req, res) => {
  res.send("Hello!");
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = "spotify_auth_state";

//STEP 1: Request authorization from Spotify (User Login)
app.get("/login", (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // define Spotify authorization scopes
  const scope = [
    "user-read-private", // needed to save tracks to users' library
    "user-top-read", // to read top tracks
    "user-library-modify", // to save tracks to users' library
  ].join(" ");

  // define query params
  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

//STEP 2: Use auth code to request access token
app.get("/callback", (req, res) => {
  // req.query is an object containing a property for each query string parameter.
  const code = req.query.code || null;

  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    //use querystring.stringify() in the data object to format the three body params required by Spotify
    data: querystring.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    //resolving the promise axios returns
    .then((response) => {
      if (response.status === 200) {
        //destructure the access_token, refresh_token & expires_in (3600s) from the response
        const { access_token, refresh_token, expires_in } = response.data;

        //format the access_token and refresh_token as query params to pass to the redirect URL
        const queryParams = querystring.stringify({
          access_token,
          refresh_token,
          expires_in,
        });

        //redirect the user to http://localhost:3000 (the React app) – the URL will be updated to include the access_token and refresh_token query params
        res.redirect(`${FRONTEND_URI}/steps?${queryParams}`);
      } else {
        //when the response is not 200
        res.redirect(`/?${querystring.stringify({ error: "invalid_token" })}`);
      }
    })
    .catch((error) => {
      res.send(error);
    });
});

//STEP 4: Use the refresh token to request a new access token after the time limit
app.get("/refresh_token", (req, res) => {
  const refresh_token = req.query.refresh_token || null;

  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
});

// All remaining requests return the React app, so it can handle routing.
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// Return that express app is running after starting the server
app.listen(PORT, () => {
  console.log(`Express app listening at http://localhost:${PORT}`);
});
