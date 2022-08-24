# Zoom Server-to-Server (s2s) Oauth Token Generation

Utility script to generate a Zoom server-to-server oauth token (valid 1hr). https://marketplace.zoom.us/docs/guides/build/server-to-server-oauth-app/

## Installation

`https://github.com/zoom/Server-to-Server-Oauth-Token.git`

## Setup

1. Enter project directory

`cd s2s`

2. Install project dependencies

`npm install`

3. Required environment variables are as follows: 

`ZOOM_ACCOUNT_ID=xxxxxxxxxxx`

`ZOOM_CLIENT_ID=xxxxxxxxxxxx`

`ZOOM_CLIENT_SECRET=xxxxxxxxxxx`


These can be found once you create a Server-to-Server app type in Zoom's Marketplace. Upon first run, you will be prompted for these values if they are not already in your environment.

![Screen Shot 2022-08-23 at 12 16 51 PM](https://user-images.githubusercontent.com/81645097/186247760-8d3c22c0-ff4c-4f74-b606-2c2508bb2a5e.png)


## Usage

`node s2s.js`

Your Zoom Access Token should now be copied to your clipboard and displayed in the terminal. Printed below your access_token, you'll also see the scopes associated with the token. If you enter incorrect Zoom credentials, delete your .env file and run the script again. All Zoom Server-to-Server tokens are valid for 1 hour. When your token expires, just run the script again to generate a new one!

