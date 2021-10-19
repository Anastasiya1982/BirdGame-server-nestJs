
# Birds Server Nest.js

## Description

This  applications was made with Nest.js .It is a framework for building efficient, scalable Node.js server-side application.
It uses modern JavaScript, is built with TypeScript.

## Getting started

### Installing dependencies

First, you need to install all the needed dependencies.

$ npm install

### Add your own  credentials

 There are a special  configurations for the database in the  .env file.

 You need to add your own:

#### MongoDB

Ensure that you have mongoDB installed on your machine or  that you have mongoDB cluster or create a new cluster to save data to MongoDB [https://www.mongodb.com
]("https://www.mongodb.com")
 Add your connection IP address to your IP Access List  in file.env to MONGOOSE=

#### Mail

The Gmail service is used to send an activation link. Ensure thet you have gmail account and pass in to .env file after  EMAIL_USER=

Ensure thet you have  passed the password of your account  in to .env file after EMAIL_PASSWORD=

## Run the application

$ npm run start:dev
