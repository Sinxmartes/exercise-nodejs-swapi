import api from "../services/apiSwapi";

async function changeValue(name: string, id: number) {
    try {
        const { data } = await api.get(`/${name}/${id}`);
        return data.name ? data.name : data.title;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`name: ${name} \n id: ${id}`);
            console.error(error.message);
        }
    }
}

async function getCategory(name: string) {
    try {
        switch (name) {
            case "filme":
                return "films";
            case "personagem":
                return "people";
            case "veiculos":
                return "vehicles";
            case "naves":
                return "starships";
            case "planetas":
                return "planets";
            case "especies":
                return "species";
            default:
                return "";
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`name: ${name}`);
            console.error(error.message);
        }
        return "";
    }
}

export { changeValue, getCategory };
