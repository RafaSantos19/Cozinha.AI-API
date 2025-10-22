import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import authRouter from './routes/AuthRoutes.js';
import userRouter from './routes/UserRoutes.js';
import recipeRouter from './routes/RecipeRoutes.js';

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/recipe", recipeRouter);

app.get("/teste", (req, res) => {
    res.json({message: "Vivo"})
});

app.listen(PORT, err => {
    if(err){
        console.log("Erro ao inicializar o servidor");
        return err;
    }

    console.log(`Servidor rodando na porta ${PORT}`);
})
