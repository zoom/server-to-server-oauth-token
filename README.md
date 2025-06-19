# Zoom Server-to-Server (s2s) Oauth Token Generation

**The JWT app type will be deprecated in June, 2023. We recommend that you create Server-to-Server OAuth or OAuth apps to replace the functionality of a JWT app in your account. Additionally, if you are using a JWT app type for the Meeting SDK for Web, you should migrate to an SDK app type instead.**

The primary goal of this repository is to serve as an example for generating a [Zoom Server-to-Server Oauth Token](https://marketplace.zoom.us/docs/guides/build/server-to-server-oauth-app/) (valid 1hr). Running this project successfully will copy your access_token to the clipboard for quick usage as well as print the scopes associated with the token. Before proceeding, please ensure you've created a Server-to-Server app type in the [Zoom Marketplace](https://marketplace.zoom.us/) to gather the required credentials.

## Installation

`git clone https://github.com/zoom/Server-to-Server-Oauth-Token.git`

## Setup

1. Enter project directory

`cd Server-to-Server-Oauth-Token`

2. Install project dependencies

`npm install`

3. Required environment variables are as follows: 

`ZOOM_ACCOUNT_ID=xxxxxxxxxxx`

`ZOOM_CLIENT_ID=xxxxxxxxxxxx`

`ZOOM_CLIENT_SECRET=xxxxxxxxxxx`


These can be found once you create and activate a Server-to-Server app type in https://marketplace.zoom.us/. Upon first run, you will be prompted for these values if they are not already in your environment.

<img width="733" alt="Screenshot 2025-06-19 at 2 33 46 PM" src="https://github.com/user-attachments/assets/7e47be7a-924b-415d-81c8-717f455fbf7e" />



## Usage

`node s2s.js`

Your Zoom Access Token should now be copied to your clipboard and displayed in the terminal. Printed below your access_token, you'll also see the scopes associated with the token. If you enter incorrect Zoom credentials, delete your .env file and run the script again. All Zoom Server-to-Server tokens are valid for 1 hour. When your token expires, just run the script again to generate a new one!

## Need help?

If you're looking for help, try [Developer Support](https://devsupport.zoom.us)   or our [Developer Forum](https://devforum.zoom.us). Priority support is also available with [Premier Developer Support](https://zoom.us/docs/en-us/developer-support-plans.html) plans.
