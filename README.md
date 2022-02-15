# [API] Project Green Map
A Restful API for Project Green Map

## Development

### Step 0: Install Nodejs and gcloud CLI
-----------------------------------------
Nodejs Installation Guide: https://nodejs.org/en/download/  
Google Cloud CLI Installation Guide: https://cloud.google.com/sdk/docs/install  
  
### Step 0.5: Install Yarn
--------------------------
`npm` has been unbelievably slow for me (WSL2 on Windows 11), so I will recommand `yarn` as an alternative.  
yarn Installation Guide: https://classic.yarnpkg.com/lang/en/docs/install/  
More about yarn: https://classic.yarnpkg.com/en/  
  
### Step 1: Set up project
--------------------------
Run in the repo directory:
```bash
yarn
```
or if you use `npm`:
```bash
npm install
```
The tools will download and install the packages needed to start developing.


## Project Structure
```
├── functions             # Source files (TypeScript)
├── dist                  # Compiled files (Javascript, structually mirrors functions)
├── index.ts              # The "main" source file
├── index.js              # The entry point of the project, compiled from index.ts, 
├── package.json          # Nodejs project configuration
├── tsconfig.json         # TypeScript compiler configuration
└── README.md
```
## Google Maps API key

Google Maps Platform requires credentials in form of an API key. It can be obtained by following instructions: https://developers.google.com/maps/documentation/javascript/get-api-key

Create a `.env` file in the folder src:
```
JS_API_KEY="YOURAPIKEY"
``` 

## Build
TypeScript must be compiled to JavaScript before we can run the project:
```
npm run build
```

## Test
### Running Google's Test Server
Simulate how Google will run our function:
```
npm run test
```
This is configured to run `cloudFunction` exported by `index.js`.