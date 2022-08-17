# Zoom Server-to-Server (s2s) Oauth Token Generation

Utility script to generate a Zoom server-to-server oauth token for quick api testing (valid 1hr). https://marketplace.zoom.us/docs/guides/build/server-to-server-oauth-app/

## Installation

`git clone https://github.com/brandonabajelo-zoom/s2s.git`

## Setup

1. Enter project directory

`cd s2s`

2. Install project dependencies

`npm install`

3.  Upon first run, you will be prompted to enter your Zoom Account Id, Client Id, Client Secret and an .env file will be generated for you. These credentials can be found once you create a Server-to-Server app type in the Zoom App Marketplace. You only need to enter your credentials once, all subsequent runs with read from your environment file.

## Usage

`node s2s.js`

Your Zoom Access Token should now be copied to your clipboard and displayed in the terminal. Printed below your access_tokens, you'll also see the scopes associated with the token. If you enter incorrect Zoom credentials, delete your .env file and run the script again.

`rm .env`

`node s2s.js`
