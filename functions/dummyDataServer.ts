import express from "express";
import {G_DIRECTION_KEY} from "./common";

import bicycling_exp from "./dummyData/bicycling.json";
import driving_exp from "./dummyData/driving.json";
import walking_exp from "./dummyData/walking.json";
import transit_mix_exp from "./dummyData/transit_bus_train.json";
import transit_train_exp from "./dummyData/transit_train.json";
import transit_bus_exp from "./dummyData/transit_bus.json";
import transit_subway_exp from "./dummyData/transit_subway.json";

enum t_param_mode {
    Driving = "driving",
    Walking = "walking",
    Bicycling = "bicycling",
    Transit = "transit"
}

enum t_param_transit_mode {
    Bus = "bus",
    Rail = "rail",
    Subway = "subway",
    Train = "train",
    Tram = "tram",
    NIL = ""
}

function parse_param_mode(m :string): t_param_mode {
    switch(m) {
        case "driving":     return t_param_mode.Driving;
        case "walking":     return t_param_mode.Walking;
        case "bicycling":
        case "cycling":     return t_param_mode.Bicycling;
        case "transit":     return t_param_mode.Transit;
        default:            return default_params.mode;
    }
}

function parse_param_transit_mode(m: string): t_param_transit_mode {
    switch(m) {
        case "bus":         return t_param_transit_mode.Bus;
        case "rail":        return t_param_transit_mode.Rail;
        case "subway":      return t_param_transit_mode.Subway;
        case "Train":       return t_param_transit_mode.Train;
        case "Tram":        return t_param_transit_mode.Tram;
        default:            return default_params.transit_mode;
    }
}

const default_params = {
    "mode": t_param_mode.Driving,
    "transit_mode": t_param_transit_mode.NIL
}

export function runThisFunction(req: express.Request, res: express.Response) {
    var _mode: t_param_mode;
    var _transit_mode: t_param_transit_mode;
    if (typeof req.query.mode == "string") {
        _mode =  parse_param_mode(req.query.mode);
    } else {
        _mode = default_params.mode;
    }

    if (typeof req.query.transit_mode == "string") {
        _transit_mode =  parse_param_transit_mode(req.query.transit_mode);
    } else {
        _transit_mode = default_params.transit_mode;
    }

    if (_mode == t_param_mode.Driving) {
        res.json(driving_exp);
    } else if (_mode == t_param_mode.Bicycling) {
        res.json(bicycling_exp);
    } else if (_mode == t_param_mode.Walking) {
        res.json(walking_exp);
    } else {
        switch(_transit_mode) {
            case t_param_transit_mode.Bus: 
                res.json(transit_bus_exp);
                break;
            case t_param_transit_mode.Train:
                res.json(transit_train_exp);
                break;
            case t_param_transit_mode.Subway:
                res.json(transit_subway_exp);
                break;
            default:
                res.json(transit_mix_exp);
                break;
        }
    }

    console.log(`Served mode: ${_mode}, transit_mode: ${_transit_mode}`);
}

