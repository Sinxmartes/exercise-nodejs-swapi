import { Router } from "express";

const router = Router();

import api from "./../services/apiSwapi";
import { changeValue, getCategory } from "../utils/getValues";

let status = 200;

router.get("/", (req, res) => {
    res.status(status).send({
        message: "Bem vindo a api Star Wars",
        status: status,
    });
});

router.get("/:category/:id", async (req, res) => {
    let { id, category } = req.params;
    try {
        status = 200;
        category = await getCategory(category);

        if (!category) {
            res.status(404).send("Não foi encontrado essa rota");
            return;
        }

        const { data } = await api.get(`/${category}/${id}`);

        await Promise.all(
            Object.entries(data).map(async (p: any) => {
                if (
                    !p[1].length ||
                    p[0] == "created" ||
                    p[0] == "edited" ||
                    p[0] == "url"
                )
                    delete data[p[0]];
                else {
                    if (p[1] instanceof Array) {
                        let name: any;
                        let id: any;
                        for (const [i, v] of p[1].entries()) {
                            name =
                                p[0] == "people" ||
                                p[0] == "characters" ||
                                p[0] == "pilots" ||
                                p[0] == "residents"
                                    ? "people"
                                    : p[0];
                            id = v.split(`${name}/`)[1];
                            p[1][i] = await changeValue(name, id);
                        }
                    } else if (p[0] == "homeworld")
                        data[p[0]] = await changeValue(
                            "planets",
                            p[1].split(`planets/`)[1]
                        );
                    //else data[p[0]] = p[1]; //não obrigatório
                }
            })
        );

        res.status(status).send(data);
    } catch (e: unknown) {
        status = 404;
        if (e instanceof Error) {
            res.status(status).send({
                status,
                error: e.message,
            });
        } else {
            console.error(Date.now());
            console.error(e);
            console.error("\n");
            status = 500;
            res.status(status).send({
                status,
                error: "houve problema ao executar o processo",
            });
        }
    }
});

export default router;
