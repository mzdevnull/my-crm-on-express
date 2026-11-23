import cors from 'cors';
require("reflect-metadata");
import { authMiddleware } from './authMiddleware.js'
import { secretKey } from './config.js';
const express = require("express");
const { User } = require("./db/user.entity");
const { Client } = require("./db/clients.entity");
const { Projects } = require("./db/projects.entity");
const { myDataSource } = require("./db/app-data-source");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



async function bootstrap() {


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

            res.status(201).json({ username: savedUser.username });


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

            res.json({ token, username: user.username });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Ошибка сервера"
            });
        }
    });
    app.post('/clients', authMiddleware, async function (req, res) {
        try {
            const clientRepository = myDataSource.getRepository(Client);
            const { name, company, email } = req.body;

            const newClient = clientRepository.create({
                name,
                company,
                email
            });
            const savedClient = await clientRepository.save(newClient);
            res.json({ savedClient });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Ошибка сервера"
            });
        }

    })
    app.delete('/clients/:id', authMiddleware, async function (req, res) {
        try {

            const clientRepository = myDataSource.getRepository(Client);
            const deletedClient = await clientRepository.findOneBy({ id: Number(req.params.id) })
            if (!deletedClient) {
                return res.status(404).json({
                    error: "Client not found"
                });
            }
            await clientRepository.remove(deletedClient);
            res.json({ deletedClient })
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Ошибка сервера"
            });
        }

    })
    app.patch('/clients/:id', authMiddleware, async (req, res) => {
        try {
            const { id } = req.params;
            const { name, company, email } = req.body;

            const clientRepo = myDataSource.getRepository(Client);

            const client = await clientRepo.findOneBy({
                id: Number(id)
            });

            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }

            client.name = name;
            client.company = company;
            client.email = email;

            const updatedClient = await clientRepo.save(client);

            res.json(updatedClient);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    app.get('/projects', authMiddleware, async (req, res) => {
        try {
            const projects = await myDataSource.getRepository(Projects).find();
            res.json(projects);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    });

    app.post('/projects', authMiddleware, async (req, res) => {
        try {
            const projectRepository = myDataSource.getRepository(Projects);
            const { title, description, status, due } = req.body;
            const newProject = projectRepository.create({ title, description, status, due });
            const savedProject = await projectRepository.save(newProject);
            res.status(201).json({ savedProject });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    });

    app.delete('/projects/:id', authMiddleware, async (req, res) => {
        try {
            const projectRepository = myDataSource.getRepository(Projects);
            const project = await projectRepository.findOneBy({ id: Number(req.params.id) });
            if (!project) return res.status(404).json({ error: "Project not found" });
            await projectRepository.remove(project);
            res.json({ deletedProject: project });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    });

    app.patch('/projects/:id', authMiddleware, async (req, res) => {
        try {
            const projectRepository = myDataSource.getRepository(Projects);
            const project = await projectRepository.findOneBy({ id: Number(req.params.id) });
            if (!project) return res.status(404).json({ error: "Project not found" });
            const { title, description, status, due } = req.body;
            project.title = title;
            project.description = description;
            project.status = status;
            project.due = due;
            res.json(await projectRepository.save(project));
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    });


    app.listen(3000, function () {
        console.log("Server started on http://localhost:3000");
    });
}

bootstrap();
