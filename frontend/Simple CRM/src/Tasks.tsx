import "./Tasks.css";

type TaskStatus = "In progress" | "To do" | "Completed";
type TaskPriority = "High" | "Medium" | "Low";

interface Task {
  title: string;
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  due: string;
  initials: string;
  color: string;
}

const tasks: Task[] = [
  { title: "Review homepage wireframes", project: "Website redesign", status: "In progress", priority: "High", due: "Today", initials: "AM", color: "violet" },
  { title: "Prepare onboarding checklist", project: "Client onboarding", status: "To do", priority: "Medium", due: "Tomorrow", initials: "JS", color: "blue" },
  { title: "Finalize campaign visuals", project: "Q4 campaign", status: "Completed", priority: "Low", due: "Nov 20", initials: "MK", color: "orange" },
  { title: "Test mobile navigation", project: "Mobile app launch", status: "In progress", priority: "Medium", due: "Nov 24", initials: "AM", color: "violet" },
];

function Tasks() {
  const completed = tasks.filter((task) => task.status === "Completed").length;
  const active = tasks.filter((task) => task.status === "In progress").length;
  const waiting = tasks.filter((task) => task.status === "To do").length;

  return (
    <section className="tasks-page">
      <header className="tasks-heading">
        <div>
          <span className="tasks-eyebrow">WORKSPACE</span>
          <h1>Tasks</h1>
          <p>Keep your work moving, one task at a time.</p>
        </div>
        <button className="tasks-add-button" type="button"><span>＋</span> New task</button>
      </header>

      <div className="tasks-summary">
        <article><span className="tasks-summary-icon purple">↗</span><div><small>In progress</small><strong>{active}</strong></div></article>
        <article><span className="tasks-summary-icon amber">◷</span><div><small>To do</small><strong>{waiting}</strong></div></article>
        <article><span className="tasks-summary-icon green">✓</span><div><small>Completed</small><strong>{completed}</strong></div></article>
      </div>

      <div className="tasks-panel">
        <div className="tasks-panel-heading">
          <div><h2>All tasks</h2><p>Your recent project tasks</p></div>
          <button className="tasks-filter-button" type="button">All tasks <span>⌄</span></button>
        </div>
        <div className="tasks-table-wrap">
          <table className="tasks-table">
            <thead><tr><th>Task</th><th>Project</th><th>Status</th><th>Priority</th><th>Due date</th><th>Assignee</th></tr></thead>
            <tbody>{tasks.map((task) => (
              <tr key={task.title}>
                <td><div className="task-title-cell"><span className={`task-check ${task.status === "Completed" ? "checked" : ""}`}>{task.status === "Completed" ? "✓" : ""}</span><strong>{task.title}</strong></div></td>
                <td className="task-project-name">{task.project}</td>
                <td><span className={`task-status-tag ${task.status.toLowerCase().replace(" ", "-")}`}><i />{task.status}</span></td>
                <td><span className={`task-priority-tag ${task.priority.toLowerCase()}`}><i />{task.priority}</span></td>
                <td className="task-due-date">{task.due}</td>
                <td><span className={`task-assignee ${task.color}`}>{task.initials}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Tasks;
