import express from "express";

export function runThisFunction(req: express.Request, res: express.Response) {
    res.status(200);
    res.send("Hello World!");
}