require('dotenv').config({ path: __dirname+'/.env' });
console.log(process.env.JS_API_KEY)

import {runThisFunction as cloudFunction} from "./functions/dummyDataServer";

export {cloudFunction};
