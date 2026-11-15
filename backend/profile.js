import cors from 'cors';
require("reflect-metadata");
import { authMiddleware } from './authMiddleware.js'
const express = require("express");
const { Client } = require("./db/clients.entity");
const { myDataSource } = require("./db/app-data-source");
const app = express();
app.use(express.json());
app.post('/clients', authMiddleware, async function (req, res) {
    try {
        const clientRepository = myDataSource.getRepository(Client);
        const { username } = req.body;
        const newClient = clientRepository.create({
            username: username,
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