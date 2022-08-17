import env from 'dotenv';
import fs from 'fs';
import prompt from 'prompt';
import axios from 'axios';
import qs from 'query-string';
import { spawn } from 'child_process';

const ENVIRONMENT_SET = !!fs.existsSync('./.env');

const ZOOM_OAUTH_ENDPOINT = 'https://zoom.us/oauth/token';

const INPUT_SCHEMA = {
    properties: {
      'ZOOM ACCOUNT ID': { required: true },
      'ZOOM CLIENT ID': { required: true },
      'ZOOM CLIENT SECRET': { required: true }
    }
};

const getToken = async (account_id = '', client_id = '', client_secret = '') => {
  try {
    const request = await axios.post(
      ZOOM_OAUTH_ENDPOINT,
      qs.stringify({ grant_type: 'account_credentials', account_id: account_id }),
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`, 'utf8').toString('base64')}`,
        }
      }
    );

    const response = await request.data;
    return copyToken(response);

  } catch (e) {
    console.log(e)
  }
}

const copyToken = ({ access_token, scope }) => {
    const cmd = spawn('pbcopy');
    cmd.stdin.write(access_token);
    cmd.stdin.end();
  
    console.log(`\nZoom Server-to-Server Oauth token copied to clipboard:`);
    console.log('------------------------------------------------------')
    console.log(access_token);
    console.log('\nScopes:')
    console.log('-------')
    scope?.split(' ').forEach(scope => console.log(scope))
};


const loadFromEnvironment = () => {
   env.config();
   const { ACCOUNT_ID, CLIENT_ID, CLIENT_SECRET } = process.env;
   getToken(ACCOUNT_ID, CLIENT_ID, CLIENT_SECRET);
};

const generateEnvironment = () => {
    prompt.start();
    prompt.get(INPUT_SCHEMA, (err, input) => {
      const accountId = input['ZOOM ACCOUNT ID'];
      const clientId = input['ZOOM CLIENT ID'];
      const clientSecret = input['ZOOM CLIENT SECRET'];
  
      fs.writeFile('.env', `ACCOUNT_ID=${accountId}\nCLIENT_ID=${clientId}\nCLIENT_SECRET=${clientSecret}`, writeError => {
        if (writeError) throw writeError
        console.log('Environment file created with Zoom Credentials');
  
        getToken(accountId, clientId, clientSecret);
        
      });
  
    })
  };

ENVIRONMENT_SET ? loadFromEnvironment() : generateEnvironment();
