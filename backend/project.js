require("reflect-metadata");
const express = require("express");
const cors = require("cors");
const { authMiddleware } = require("./authMiddleware.js");
const { secretKey } = require("./config.js");
const { User } = require("./db/user.entity");
const { Projects } = require("./db/projects.entity");
const { myDataSource } = require("./db/app-data-source");
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json());
app.use(express.static(__dirname));

app.get('/projects', authMiddleware, async function (req, res) {
    try {
        const projectRepository = myDataSource.getRepository(Projects);
        const projects = await projectRepository.find();
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.post('/projects', authMiddleware, async function (req, res) {
    try {
        const projectRepository = myDataSource.getRepository(Projects);
        const { title, description, status, due } = req.body;

        const newProject = projectRepository.create({
            title, description, status, due
        });
        const savedProject = await projectRepository.save(newProject);
        res.json({ savedProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Ошибка сервера"
        });
    }

})
app.delete('/projects/:id', authMiddleware, async function (req, res) {
    try {

        const projectRepository = myDataSource.getRepository(Projects);
        const deletedProject = await projectRepository.findOneBy({ id: Number(req.params.id) })
        if (!deletedProject) {
            return res.status(404).json({
                error: "Project not found"
            });
        }
        await projectRepository.remove(deletedProject);
        res.json({ deletedProject })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Ошибка сервера"
        });
    }

})
app.patch('/projects/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, due } = req.body;

        const projectRepository = myDataSource.getRepository(Projects);

        const project = await projectRepository.findOneBy({
            id: Number(id)
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.title = title;
        project.description = description;
        project.status = status;
        project.due = due;

        const updatedProject = await projectRepository.save(project);

        res.json(updatedProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
