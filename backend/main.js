import cors from 'cors';
require("reflect-metadata");


const express = require("express");
const { User } = require("./db/user.entity");
const { Client } = require("./db/clients.entity");
const { myDataSource } = require("./db/app-data-source");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



async function bootstrap() {
    const secretKey = process.env.JWT_SECRET || "change-this-secret";

    try {
        await myDataSource.initialize();
        console.log("Data Source has been initialized!");
    } catch (error) {
        console.error("Error during Data Source initialization:", error);
        return;
    }

    const app = express();

    app.use(express.json());
    app.use(express.static(__dirname));
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }));

    
    app.get("/users", async function (req, res) {
        try {
            const users = await myDataSource.getRepository(User).find();

            res.json(users);
        } catch (error) {
            res.status(500).json({ error: "Ошибка сервера" });
        }
    });

   
    app.get("/users/:id", async function (req, res) {
        try {
            const user = await myDataSource.getRepository(User).findOneBy({
                id: Number(req.params.id)
            });

            if (!user) {
                return res.status(404).json({ error: "Пользователь не найден" });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: "Ошибка сервера" });
        }
    });


    app.post("/register", async function (req, res) {
        try {
            const userRepository = myDataSource.getRepository(User);

            const { username, password } = req.body;

            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = userRepository.create({
                username: username,
                password: passwordHash
            });

            const savedUser = await userRepository.save(newUser);

            res.json({ savedUser });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Ошибка сервера"
            });
        }
    });

    
    app.post("/login", async function (req, res) {
        try {
            const userRepository = myDataSource.getRepository(User);

            const { username, password } = req.body;

            const user = await userRepository.findOneBy({
                username: username
            });

            if (!user) {
                return res.status(401).json({
                    error: "Неверный логин или пароль"
                });
            }

            const isPwd = await bcrypt.compare(password, user.password);

            if (!isPwd) {
                return res.status(401).json({
                    error: "Неверный логин или пароль"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username
                },
                secretKey,
                {
                    expiresIn: "1d"
                }
            );

            res.json({ token });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Ошибка сервера"
            });
        }
    });
    app.post('/clients', async function (req,res){
        try {
            const clientRepository = myDataSource.getRepository(Client);

            const { username } = req.body;

            

            const newClient = clientRepository.create({
                username: username,
                
            });

            const savedClient = await clientRepository.save(newClient);

            res.json({ savedClient});

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Ошибка сервера"
            });
        }

    })

    app.listen(3000, function () {
        console.log("Server started on http://localhost:3000");
    });
}

bootstrap();
