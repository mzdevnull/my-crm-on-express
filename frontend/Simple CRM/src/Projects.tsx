import { useEffect, useState } from "react";
import "./Projects.css";

interface Project {
  id: number;
  title: string;
  description: string;
  status: "In progress" | "Planning" | "Review" | "Completed";
  due: string;
  progress: number;
}
const statusClass: Record<Project["status"], string> = {
  "In progress": "in-progress",
  Planning: "planning",
  Review: "review",
  Completed: "completed",
};

function Projects() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Project["status"]>("Planning");
  const [due, setDue] = useState("");
  const [progress, setProgress] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All statuses");
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
          progress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Ошибка создания проекта:", data);
        return;
      }

      setProjects((currentProjects) => [
        ...currentProjects,
        { ...data.savedProject, progress: data.savedProject.progress ?? progress },
      ]);

      setTitle("");
      setDescription("");
      setStatus("Planning");
      setDue("");
      setProgress(0);
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

  function changeProjectData(projectId: number) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;
    setEditingProjectId(projectId);
    setTitle(project.title);
    setDescription(project.description);
    setStatus(project.status);
    setDue(project.due || "");
    setProgress(project.progress ?? 0);
    setSelectedProject(null);
    setIsEditOpen(true);
  }
  const filteredProjects = projects.filter((project) => {
    if (statusFilter === "All statuses") {
      return true;
    }

    return project.status === statusFilter;
  });

  async function updateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingProjectId === null) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/projects/${editingProjectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status, due, progress }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Ошибка обновления проекта:", data);
        return;
      }
      setProjects((current) =>
        current.map((project) => project.id === editingProjectId
          ? { ...project, ...data, progress: data.progress ?? progress }
          : project),
      );
      setIsEditOpen(false);
      setEditingProjectId(null);
    } catch (error) {
      console.error("Ошибка запроса при обновлении проекта:", error);
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

        <label htmlFor="project-status-filter">Filter by status</label>
        <select
          id="project-status-filter"
          className="projects-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option>All statuses</option>
          <option>Planning</option>
          <option>In progress</option>
          <option>Review</option>
          <option>Completed</option>
        </select>
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project) => (
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
                <span>Progress</span>
                <strong>{project.progress ?? 0}%</strong>
              </div>
              <div className="project-progress-track">
                <span
                  style={{
                    width: `${project.progress ?? 0}%`,
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

              <div className="project-progress-input">
                <div className="project-progress-input-heading">
                  <label htmlFor="project-progress">Project progress</label>
                  <strong>{progress}%</strong>
                </div>
                <input id="project-progress" type="range" min="0" max="100" step="1" value={progress} style={{ background: `linear-gradient(to right, #7028F5 0%, #7028F5 ${progress}%, #e8e1f2 ${progress}%, #e8e1f2 100%)` }} onChange={(event) => setProgress(Number(event.target.value))} />
                <div className="progress-range-labels"><span>0%</span><span>100%</span></div>
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
            className="client-modal project-modal project-details-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="details-topline">
              <span className="details-eyebrow">PROJECT DETAILS</span>
              <button className="close-button" type="button" onClick={() => setSelectedProject(null)}>×</button>
            </div>
            <div className="details-title-row">
              <div>
                <h2>{selectedProject.title}</h2>
                <p>Project workspace · #{selectedProject.id}</p>
              </div>
              <span className={`project-tag ${statusClass[selectedProject.status]}`}>
                <span className="project-tag-dot" />{selectedProject.status}
              </span>
            </div>
            <nav className="details-tabs" aria-label="Project detail sections">
              <button className="active" type="button">Overview</button>
              <button type="button">Tasks</button>
              <button type="button">Files</button>
              <button type="button">Activity</button>
            </nav>
            <div className="details-content">
              <section className="details-progress-card">
                <div className="details-progress-heading">
                  <div><span>PROJECT PROGRESS</span><strong>{selectedProject.progress ?? 0}%</strong></div>
                  <span className="details-progress-caption">Completion</span>
                </div>
                <div className="details-progress-track"><span style={{ width: `${selectedProject.progress ?? 0}%` }} /></div>
              </section>
              <section className="details-section">
                <h3>Project information</h3>
                <p className="details-description">{selectedProject.description || "No project description yet."}</p>
                <div className="details-info-grid">
                  <div><span>Client</span><strong>—</strong></div>
                  <div><span>Created</span><strong>—</strong></div>
                  <div><span>Deadline</span><strong>{selectedProject.due || "Not set"}</strong></div>
                  <div><span>Budget</span><strong>—</strong></div>
                </div>
              </section>
              <section className="details-section">
                <h3>Task statistics</h3>
                <div className="details-task-stats">
                  <div><span className="task-stat-dot done"/><span>Completed</span><strong>—</strong></div>
                  <div><span className="task-stat-dot active"/><span>In progress</span><strong>—</strong></div>
                  <div><span className="task-stat-dot waiting"/><span>To do</span><strong>—</strong></div>
                </div>
              </section>
            </div>
            <div className="details-actions">
              <button className="details-secondary-button" type="button" onClick={() => setSelectedProject(null)}>Close</button>
              <button className="details-primary-button" type="button" onClick={() => changeProjectData(selectedProject.id)}>Edit project</button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="modal-overlay" onClick={() => setIsEditOpen(false)}>
          <div className="client-modal project-modal project-edit-modal" onClick={(event) => event.stopPropagation()}>
            <div className="edit-modal-heading">
              <div className="edit-modal-icon" aria-hidden="true">✎</div>
              <div className="edit-modal-title">
                <span className="details-eyebrow">PROJECT SETTINGS</span>
                <h2>Edit project</h2>
                <p>Keep your project information up to date.</p>
              </div>
              <button className="close-button" type="button" onClick={() => setIsEditOpen(false)}>×</button>
            </div>
            <form onSubmit={updateProject}>
              <div className="edit-form-section">
                <div className="edit-section-heading">
                  <span className="edit-section-number">01</span>
                  <div><strong>Project information</strong><small>Name and description</small></div>
                </div>
                <label htmlFor="edit-project-title">Project name</label>
                <input id="edit-project-title" value={title} onChange={(event) => setTitle(event.target.value)} required />
                <label htmlFor="edit-project-description">Description</label>
                <textarea id="edit-project-description" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
              </div>
              <div className="edit-form-section edit-form-meta">
                <div className="edit-section-heading">
                  <span className="edit-section-number">02</span>
                  <div><strong>Timeline and status</strong><small>Track the project lifecycle</small></div>
                </div>
              <div className="project-form-row">
                <div>
                  <label htmlFor="edit-project-status">Status</label>
                  <select id="edit-project-status" value={status} onChange={(event) => setStatus(event.target.value as Project["status"])}>
                    <option>Planning</option>
                    <option>In progress</option>
                    <option>Review</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-project-due">Due date</label>
                  <input id="edit-project-due" type="date" value={due} onChange={(event) => setDue(event.target.value)} />
                </div>
              </div>
              <div className="project-progress-input">
                <div className="project-progress-input-heading">
                  <label htmlFor="edit-project-progress">Project progress</label>
                  <strong>{progress}%</strong>
                </div>
                <input id="edit-project-progress" type="range" min="0" max="100" step="1" value={progress} style={{ background: `linear-gradient(to right, #7028F5 0%, #7028F5 ${progress}%, #e8e1f2 ${progress}%, #e8e1f2 100%)` }} onChange={(event) => setProgress(Number(event.target.value))} />
                <div className="progress-range-labels"><span>0%</span><span>100%</span></div>
              </div>
              </div>
              <div className="edit-modal-footer">
                <span>Changes are saved to this project.</span>
                <button className="modal-submit" type="submit">Save changes <span aria-hidden="true">→</span></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Projects;
