# Basic OAuth flow

I created this simple app to reinforce the concepts I learned about 3 legged OAuth. This app uses the GitHub OAuth web flow.

### Features

- [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- Serverside rendering
- JSON Web Tokens

### Technologies

- [Node](https://node.js.org/) v14.17.0
- [Express](http://expressjs.com/)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [EJS](https://ejs.co/)
- [Axios](https://www.npmjs.com/package/axios)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)

### Installation

This app requires [Node.js](https://node.js.org/) v14.17.0 to run

Install the dependecies

```sh
$ npm install
```

Start the dev server

```sh
$ cd 3legged-oath-basic-example
$ node server.js
```

You will need to add your own environment variables

Example env file:

```
GITHUB_CLIENT_ID="Insert your client ID here"
GITHUB_SECRET="Your client secret goes here"
MY_SECRET="random string used to sign JWT"
```
