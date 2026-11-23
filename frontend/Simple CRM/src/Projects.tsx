import { useEffect, useState } from "react";
import "./Projects.css";

interface Project {
  id: number;
  title: string;
  description: string;
  status: "In progress" | "Planning" | "Review" | "Completed";
  due: string;
}

const statusClass: Record<Project["status"], string> = {
  "In progress": "in-progress",
  Planning: "planning",
  Review: "review",
  Completed: "completed",
};

function Projects() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Project["status"]>("Planning");
  const [due, setDue] = useState("");

  const API_URL = "http://localhost:3000";

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Не удалось загрузить проекты");
        }

        setProjects(data);
      })
      .catch((error) => {
        console.error("Ошибка загрузки проектов:", error);
      });
  }, []);

  async function addProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          status,
          due,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Ошибка создания проекта:", data);
        return;
      }

      setProjects((currentProjects) => [
        ...currentProjects,
        data.savedProject,
      ]);

      setTitle("");
      setDescription("");
      setStatus("Planning");
      setDue("");
      setIsAddOpen(false);
    } catch (error) {
      console.error("Ошибка запроса:", error);
    }
  }

  async function deleteProject(projectId: number) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Ошибка удаления проекта:", data);
        return;
      }
      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== projectId),
      );
      if (selectedProject?.id === projectId) setSelectedProject(null);
    } catch (error) {
      console.error("Ошибка запроса при удалении проекта:", error);
    }
  }

  const inProgressCount = projects.filter(
    (project) => project.status === "In progress",
  ).length;

  const completedCount = projects.filter(
    (project) => project.status === "Completed",
  ).length;

  return (
    <section className="projects-page">
      <div className="projects-welcome">
        <div>
          <span className="welcome-label">WORKSPACE</span>
          <h1>Projects</h1>
          <p>Plan, track, and deliver work with your team.</p>
        </div>

        <button
          className="add-client-button"
          type="button"
          onClick={() => setIsAddOpen(true)}
        >
          <span>+</span>New project
        </button>
      </div>

      <div className="projects-stats">
        <div className="project-stat-card">
          <span>Total projects</span>
          <strong>{projects.length}</strong>
          <small>Across your workspace</small>
        </div>

        <div className="project-stat-card">
          <span>In progress</span>
          <strong className="primary-stat">{inProgressCount}</strong>
          <small>Projects currently active</small>
        </div>

        <div className="project-stat-card">
          <span>Completed</span>
          <strong className="success-stat">{completedCount}</strong>
          <small>Completed projects</small>
        </div>
      </div>

      <div className="projects-section-heading">
        <div>
          <h2>All projects</h2>
          <p>Keep track of your team's active work.</p>
        </div>

        <button className="projects-filter" type="button">
          All statuses <span>⌄</span>
        </button>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.id}>
            <div className="project-card-header">
              <h3>{project.title}</h3>
              <button
                className="project-more"
                type="button"
                aria-label={`Delete ${project.title}`}
                title="Delete project"
                onClick={() => deleteProject(project.id)}
              >
                🗑
              </button>
            </div>

            <p className="project-description">{project.description}</p>

            <div className="project-meta">
              <span className={`project-tag ${statusClass[project.status]}`}>
                <span className="project-tag-dot" aria-hidden="true" />
                {project.status}
              </span>
              <span className="project-due">{project.due || "No due date"}</span>
            </div>

            <div className="project-progress">
              <div className="project-progress-label">
                <span>Status</span>
                <strong>{project.status}</strong>
              </div>
              <div className="project-progress-track">
                <span
                  style={{
                    width: project.status === "Completed" ? "100%" : "0%",
                  }}
                />
              </div>
            </div>

            <div className="project-card-footer">
              <span />
              <button
                className="project-view"
                type="button"
                onClick={() => setSelectedProject(project)}
              >
                View project →
              </button>
            </div>
          </article>
        ))}
      </div>

      {isAddOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsAddOpen(false)}
        >
          <div
            className="client-modal project-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>New project</h2>
                <p>Create a project for your workspace.</p>
              </div>

              <button
                className="close-button"
                type="button"
                onClick={() => setIsAddOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={addProject}>
              <label htmlFor="project-title">Project name</label>
              <input
                id="project-title"
                placeholder="Website redesign"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />

              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                placeholder="What is this project about?"
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />

              <div className="project-form-row">
                <div>
                  <label htmlFor="project-status">Status</label>
                  <select
                    id="project-status"
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value as Project["status"])
                    }
                  >
                    <option>Planning</option>
                    <option>In progress</option>
                    <option>Review</option>
                    <option>Completed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="project-due-date">Due date</label>
                  <input
                    id="project-due-date"
                    type="date"
                    value={due}
                    onChange={(event) => setDue(event.target.value)}
                  />
                </div>
              </div>

              <button className="modal-submit" type="submit">
                Create project
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedProject && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="client-modal project-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>{selectedProject.title}</h2>
                <p>Project overview</p>
              </div>

              <button
                className="close-button"
                type="button"
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>
            </div>

            <div className="project-view-details">
              <p>{selectedProject.description}</p>

              <div className="project-detail-row">
                <span>Status</span>
                <span className={`project-tag ${statusClass[selectedProject.status]}`}>
                  <span className="project-tag-dot" />
                  {selectedProject.status}
                </span>
              </div>

              <div className="project-detail-row">
                <span>Due date</span>
                <strong>{selectedProject.due || "No due date"}</strong>
              </div>

              <div className="project-detail-row">
                <span>Project ID</span>
                <strong>{selectedProject.id}</strong>
              </div>
            </div>

            <button
              className="modal-submit"
              type="button"
              onClick={() => setSelectedProject(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Projects;
