# CS4400Phase3
Final project for CS 4400: Intro to Database Systems

## First-time Setup
1. Make sure you have nodejs and npm installed
  1. To test this, run node -v and npm -v.  The output should be the current version
  2. Ubuntu users need to install nodejs-legacy.  This is easily done via apt-get
2. Clone this repo into the desired location
3. cd into the repo's directory.
4. Run 'npm install' to install any missing dependencies
5. run 'git update-index --assume-unchanged routes/credentials.js' (keeps confidential info from being pushed to the server)
6. update routes/credentials.js with the appropriate login info for your machine

## How to run
1. Go into the repo directory
2. Run 'npm start' to start the server
3. Go to localhost:3000 to see results