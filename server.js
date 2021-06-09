require('dotenv').config();
const { default: axios } = require('axios');
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

//Create an app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// Static folder and middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Listen port
const PORT = 8080;
const COOKIE_NAME = 'github-jwt';
app.listen(PORT);
console.log(`Running on port ${PORT}`);

app.get('/', (req, res) => {
  res.render('index');
  console.log('Cookies: ', res.cookies);
});

// auth route
app.get('/auth', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});

// auth callback / redirect route
app.get('/oauth-callback', async ({ query: { code } }, res) => {
  // make a post req using the auth code to exchange for token

  async function getGitHubUser(code) {
    const body = {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_SECRET,
      code,
    };

    const opts = { headers: { accept: 'application/json' } };

    const githubToken = await axios
      .post('https://github.com/login/oauth/access_token', body, opts)
      .then((res) => res.data)
      .catch((err) => res.status(500).json({ err: err.message }));

    const accessToken = githubToken.access_token;

    return axios
      .get('https://api.github.com/user', {
        headers: { Authorization: `token ${accessToken}` },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.log('error getting user from GitHub');
        console.log(error);
      });
  }

  const gitHubUser = await getGitHubUser(code);

  // sign the jwt using githubuser and secret
  const token = jwt.sign(gitHubUser, process.env.MY_SECRET, {
    expiresIn: '1h',
  });

  // set the session cookie
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    domain: 'localhost',
    //secure: true,
    //signed: true,
  });

  res.redirect('http://localhost:8080/dashboard');
});

// user dashboard route
app.get('/dashboard', (req, res) => {
  const cookie = req.cookies[COOKIE_NAME];

  try {
    // verify cookie and serve dashboard
    const decode = jwt.verify(cookie, process.env.MY_SECRET);
    console.log('decoded', decode);
    return res.render('dashboard', { decode });
  } catch (e) {
    res.render('signin');
  }
});

// about route
app.get('/about', (req, res) => {
  res.render('about');
});
