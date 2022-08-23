import env from 'dotenv';
import fs from 'node:fs';
import prompt from 'prompt';
import path from 'node:path'
import axios from 'axios';
import clipboard from 'clipboardy';
import qs from 'query-string';

const IS_PROD = process.env.NODE_ENV?.toString().toLowerCase().trim() === 'production';

// Server-to-Server app type credentials from https://marketplace.zoom.us
const ZOOM_REQUIRED_CREDENTIALS = ['ZOOM_ACCOUNT_ID', 'ZOOM_CLIENT_ID', 'ZOOM_CLIENT_SECRET'];

const ZOOM_OAUTH_ENDPOINT = 'https://zoom.us/oauth/token';

const INPUT_SCHEMA = { properties: {} };

/**
 * Check if environment contains all Zoom required credentials
 * 
 * @returns {boolean}
 */
const environmentSet = () => {
  if (!!fs.existsSync(path.join(process.cwd(), '.env'))) {
    let appCredentials = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf-8').trim();
    const credentialCheck = {};
    const credentialArray = appCredentials.toString().split('\n');

    credentialArray.forEach(line => {
      const lineItem = line.split('=');
      const key = lineItem[0];
      let val = lineItem[1] || '';

      credentialCheck[key] = val;
    });

    return ZOOM_REQUIRED_CREDENTIALS.every(cred => !!credentialCheck[cred]);
  }
  return false;
}

/**
 * Call Zoom Oauth API for Server-to-Server access token.
 *
 * @param      {Object}  input_config
 * @param      {String}  input_config.ZOOM_ACCOUNT_ID     The zoom account id
 * @param      {String}  input_config.ZOOM_CLIENT_ID      The zoom client id
 * @param      {String}  input_config.ZOOM_CLIENT_SECRET  The zoom client secret
 * @returns    {String}  zoom access_token
 */
const getToken = async ({ ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET }) => {
  try {
    const request = await axios.post(
      ZOOM_OAUTH_ENDPOINT,
      qs.stringify({ grant_type: 'account_credentials', account_id: ZOOM_ACCOUNT_ID }),
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
        }
      }
    );

    const response = await request.data;
    return copyToken(response);

  } catch (e) {
    console.error(e?.message, e?.response?.data);
  }
}

/**
 * Writes Zoom Access Token to clipboard as well as prints token and associated scopes to console
 *
 * @param      {Object}  token_object               Access Token object
 * @param      {String}  token_object.access_token  The access token
 * @param      {String}  token_object.scope         The scope list, space delimited
 */
const copyToken = ({ access_token, scope }) => {
    clipboard.write(access_token);
  
    console.log(`\nZoom Server-to-Server Oauth token copied to clipboard:`);
    console.log('------------------------------------------------------');
    console.log(access_token);
    console.log('\nScopes:');
    console.log('-------');
    scope?.split(' ').forEach(scope => console.log(scope));
};

/**
 * Prompt user for Zoom Server-to-Server Marketplace App credentials to generate .env file
 */
const generateEnvironment = () => {
    ZOOM_REQUIRED_CREDENTIALS.forEach(cred => INPUT_SCHEMA.properties[cred] = { required: true, default: process.env[cred] });

    prompt.start();

    prompt.get(INPUT_SCHEMA, (err, input) => {
      const envCredentials = Object.keys(input).map((key) => `\n${key}=${input[key]}`).join('');

      if (IS_PROD || environmentSet()) {
        console.log('\nNOTE: Ensure the following values are configured in your target environment OR .env file:\n', envCredentials, '\n')
      } else {
        fs.writeFile('.env', envCredentials, writeError => {
          if (writeError) throw writeError

          console.log('\nEnvironment file created with the following Zoom Credentials:\n', envCredentials, '\n');
        });        
      }

      getToken(input);
    })
  };

(() => {

  // Configure values from .env file
  env.config();

  try {
    const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;

    const ZOOM_CREDENTIALS = { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET };

    const requiredCredentials = Object.keys(ZOOM_CREDENTIALS).every(el => !!ZOOM_CREDENTIALS[el]);

    if (!requiredCredentials) {
      generateEnvironment();
      return
    }

    getToken(ZOOM_CREDENTIALS);

  } catch (err) {
    console.error(err)
  }

})()
