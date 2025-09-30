import { Timestamp } from "firebase-admin/firestore";

export const user = {
    name: "",
    email: "",
    //password: "",
    auth: false,
    local: "",
    goals: [],
    appliances: [],
    allergies: [],
    diet: "",
    maxTime: 0,
    skillLevel: "",
    createdAt: Timestamp
};

export const favorites = {
    sourceSuggestionId: "",
    recipe: {},
    createdAt: Timestamp
};

export const suggestions = {
    ingredientsText: "",
    ingredientsNorm: "",
    context: {},
    recipes: [],
    model: "",
    tokens: 0,
    parseOk: false,
    createdAt: Timestamp
};

const payload = {

}

