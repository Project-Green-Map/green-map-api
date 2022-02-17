import express from "express";
import {Client, TravelMode, TransitMode, DirectionsRequest, DirectionsResponseData} from "@googlemaps/google-maps-services-js";
import axios from "axios";

const dotenv = require('dotenv').config();
const JS_API_KEY = process.env.JS_API_KEY

// Global Scope: only ran at cold starts
function lookupMode (mode: string) {
    switch(mode) {
        case "driving":     return TravelMode.driving;
        case "bicycling":   return TravelMode.bicycling;
        case "transit":     return TravelMode.transit;
        case "walking":     return TravelMode.walking;
        default:            return TravelMode.driving;
    }
}

function lookupTransitMode (transit_mode: string) {
    switch (transit_mode) {
        case "bus":         return TransitMode.bus;
        case "rail":        return TransitMode.rail;
        case "train":       return TransitMode.train;
        case "tram":        return TransitMode.tram;
        case "subway":      return TransitMode.subway;
    }
}

interface CarbonResponseData extends DirectionsResponseData {
    carbon?: number[]
}

export function runThisFunction (req: express.Request, res: express.Response) {
    // params we want: origin, destination, mode*, transit_mode* (arrival_time, departure_time)*
    // alternative = true

    function complain(code: number, why: string) {
        res.set(code);
        res.send(why);
    }

    if (typeof req.query.origin != "string") {
        complain(400, "missing necessary parameter: origin");
        return;
    }
    
    if (typeof req.query.destination != "string") {
        complain(400, "missing necessary parameter: destination");
        return;
    }
    
    var _mode = TravelMode.driving;
    if (typeof req.query.mode == "string") {
        _mode = lookupMode(req.query.mode);
    }

    var _params: DirectionsRequest["params"] = {
        origin:         req.query.origin,
        destination:    req.query.destination,
        mode:           _mode,
        alternatives:   true,
        key:            JS_API_KEY! //TODO BAD BAD, fix .env
    }

    if (_mode == TravelMode.transit && req.query.transit_mode) {
        console.log(req.query.transit_mode);
        var _transit_modes: TransitMode[] = [];
        var _transit_strings: string[] = [];

        if (Array.isArray(req.query.transit_mode)) {
            for (let tm of req.query.transit_mode) {
                if (typeof tm == "string") _transit_strings.push(tm);
            }
        } else if (typeof req.query.transit_mode == "string") {
            _transit_strings = req.query.transit_mode.split('|');
        }

        for (let tm of _transit_strings) {
            let tmx = lookupTransitMode(tm);
            if (tmx) _transit_modes.push(tmx);
        }

        _params['transit_mode'] = _transit_modes;                     
    }

    if (req.query.arrival_time && typeof req.query.arrival_time == "string") {
        let try_number = parseInt(req.query.arrival_time);
        if (try_number !== NaN) {
            _params['arrival_time'] = try_number;
        }
    }

    if (req.query.departure_time && typeof req.query.departure_time == "string") {
        let try_number = parseInt(req.query.departure_time);
        if (try_number !== NaN) {
            _params['departure_time'] = try_number;
        } else if (req.query.departure_time === "now") {
            _params['departure_time'] = "now";
        }
    }

    console.log(_params);
    
    const client = new Client({})

    client.directions({
        params: _params,
        timeout: 10000
    }).then((g_res) => {
        let path_data: CarbonResponseData = g_res.data;
        axios.post(process.env.MR_CARBON_URL!, path_data)
        .then((carbon_footprints) => {
            path_data.carbon = carbon_footprints.data;
            console.log("Mr Carbon says: " + carbon_footprints.data);
            res.json(path_data);
        });
        return path_data;
    });
}