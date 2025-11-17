import { Timestamp } from "firebase-admin/firestore";

export const user = {
    name: "",
    email: "",
    //password: "",
    //auth: false,
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
    receitas: []
};

export const suggestions = {
    receitas: []
};


