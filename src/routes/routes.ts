import { writeFileSync } from "fs";
import { Router } from "express";

const router = Router();

import api from "./../services/apiSwapi";

let status = 200;

router.get("/", (req, res) => {
    res.status(status).send({
        message: "Olá Pessoa",
        status: status,
    });
});

router.get("/swapi/:id", async (req, res) => {
    const id = req.params.id;
    const param = req.query.param;
    try {
        status = 200;
        const people = await api.get(`/${param}/${id}`);
        res.status(status).send(people.data);
    } catch (error: any) {
        status = 404;
        //writeFileSync(`./../error.${Date.now().toString()}.log`, error);
        res.status(status).send({
            status,
            error,
        });
    }
});

router.post("/", (req, res) => {
    try {
        const body = req.body;
        res.status(status).json({
            message: `Olá ${body.nome} ${body.sobrenome}`,
            status: status,
        });
    } catch (error: any) {
        status = 402;
        writeFileSync(`./../error.${Date.now()}.log`, error);
        res.status(status).json({
            error: error,
            status: status,
        });
    }
});

export default router;
