import { useState } from "react";
import "./Projects.css";

interface Project {
  title: string;
  description: string;
  status: "In progress" | "Planning" | "Review" | "Completed";
  progress: number;
  due: string;
  members: string[];
}

const projects: Project[] = [
  { title: "Website redesign", description: "Refresh the Northstar marketing site.", status: "In progress", progress: 72, due: "Due Oct 18", members: ["#5367e8", "#a8b3f2", "#28a66b"] },
  { title: "Mobile app launch", description: "Prepare the mobile experience for release.", status: "Planning", progress: 34, due: "Due Nov 02", members: ["#9262d9", "#d7bdf7"] },
  { title: "Q4 campaign", description: "Coordinate the final campaign rollout.", status: "Review", progress: 86, due: "Due Oct 24", members: ["#d9853d", "#f4c9a5", "#5367e8"] },
  { title: "Client onboarding", description: "Streamline the first week for new clients.", status: "In progress", progress: 58, due: "Due Nov 10", members: ["#28a66b", "#a8d9bf"] },
  { title: "Brand system", description: "Document the visual language for the team.", status: "Planning", progress: 18, due: "Due Nov 20", members: ["#5367e8", "#d5daff"] },
  { title: "Analytics dashboard", description: "Define the reporting view for leadership.", status: "Completed", progress: 100, due: "Completed Dec 01", members: ["#28a66b", "#d3a7e8", "#5367e8"] },
];

const statusClass: Record<Project["status"], string> = {
  "In progress": "in-progress",
  Planning: "planning",
  Review: "review",
  Completed: "completed",
};

function Projects() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section className="projects-page">
      <div className="projects-welcome">
        <div>
          <span className="welcome-label">WORKSPACE</span>
          <h1>Projects</h1>
          <p>Plan, track, and deliver work with your team.</p>
        </div>
        <button className="add-client-button" type="button" onClick={() => setIsAddOpen(true)}><span>+</span>New project</button>
      </div>

      <div className="projects-stats">
        <div className="project-stat-card"><span>Total projects</span><strong>12</strong><small>Across your workspace</small></div>
        <div className="project-stat-card"><span>In progress</span><strong className="primary-stat">07</strong><small>Projects currently active</small></div>
        <div className="project-stat-card"><span>Completed</span><strong className="success-stat">05</strong><small>Delivered this quarter</small></div>
      </div>

      <div className="projects-section-heading">
        <div><h2>All projects</h2><p>Keep track of your team's active work.</p></div>
        <button className="projects-filter" type="button">All statuses <span>⌄</span></button>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
            <div className="project-card-header">
              <h3>{project.title}</h3>
              <button className="project-more" type="button" aria-label={`More options for ${project.title}`}>•••</button>
            </div>
            <p className="project-description">{project.description}</p>
            <div className="project-meta">
              <span className={`project-tag ${statusClass[project.status]}`}><span className="project-tag-dot" aria-hidden="true" />{project.status}</span>
              <span className="project-due">{project.due}</span>
            </div>
            <div className="project-progress">
              <div className="project-progress-label"><span>Progress</span><strong>{project.progress}%</strong></div>
              <div className="project-progress-track"><span style={{ width: `${project.progress}%` }} /></div>
            </div>
            <div className="project-card-footer">
              <div className="project-members" aria-label="Project members">
                {project.members.map((color, index) => <span className="project-member" key={`${project.title}-${index}`} style={{ backgroundColor: color }} />)}
              </div>
              <button className="project-view" type="button" onClick={() => setSelectedProject(project)}>View project →</button>
            </div>
          </article>
        ))}
      </div>

      {isAddOpen && (
        <div className="modal-overlay" onClick={() => setIsAddOpen(false)}>
          <div className="client-modal project-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>New project</h2>
                <p>Create a project for your workspace.</p>
              </div>
              <button className="close-button" type="button" onClick={() => setIsAddOpen(false)}>×</button>
            </div>
            <form onSubmit={(event) => { event.preventDefault(); setIsAddOpen(false); }}>
              <label htmlFor="project-title">Project name</label>
              <input id="project-title" placeholder="Website redesign" required />
              <label htmlFor="project-description">Description</label>
              <textarea id="project-description" placeholder="What is this project about?" rows={3} />
              <div className="project-form-row">
                <div>
                  <label htmlFor="project-status">Status</label>
                  <select id="project-status" defaultValue="Planning">
                    <option>Planning</option>
                    <option>In progress</option>
                    <option>Review</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="project-due-date">Due date</label>
                  <input id="project-due-date" type="date" />
                </div>
              </div>
              <button className="modal-submit" type="submit">Create project</button>
            </form>
          </div>
        </div>
      )}

      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="client-modal project-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedProject.title}</h2>
                <p>Project overview</p>
              </div>
              <button className="close-button" type="button" onClick={() => setSelectedProject(null)}>×</button>
            </div>
            <div className="project-view-details">
              <p>{selectedProject.description}</p>
              <div className="project-detail-row"><span>Status</span><span className={`project-tag ${statusClass[selectedProject.status]}`}><span className="project-tag-dot" />{selectedProject.status}</span></div>
              <div className="project-detail-row"><span>Due date</span><strong>{selectedProject.due}</strong></div>
              <div className="project-detail-row"><span>Progress</span><strong>{selectedProject.progress}%</strong></div>
              <div className="project-progress-track"><span style={{ width: `${selectedProject.progress}%` }} /></div>
            </div>
            <button className="modal-submit" type="button" onClick={() => setSelectedProject(null)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Projects;
