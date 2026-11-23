import { useEffect, useState } from "react";
import "./App.css";
import Login from "./login";
import Register from "./register";
import Projects from "./Projects";
interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
}
interface User {
  username: string;
}

function App() {
  const [clients, setClients] = useState<Client[]>([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<"dashboard" | "clients" | "projects">("dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`clients_${user.username}`, JSON.stringify(clients));
  }, [clients, user]);

  function loginUser(userData: User) {
    const storageKey = `clients_${userData.username}`;
    let savedClients = localStorage.getItem(storageKey);

    // Переносим старый общий список первому аккаунту.
    if (!savedClients && userData.username === "hello") {
      savedClients = localStorage.getItem("clients");
      if (savedClients) localStorage.removeItem("clients");
    }

    setClients(savedClients ? JSON.parse(savedClients) : []);
    setUser(userData);
    setIsLoggedIn(true);
  }

  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <Register
          onSwitchToLogin={() => setShowRegister(false)}
          onResult={() => undefined}
          onLogin={(userData) => {
            loginUser(userData);
            setShowRegister(false);
          }}
        />
      );
    }

    return (
      <Login
        onLogin={(userData) => {
          loginUser(userData);
        }}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }
  const API_URL = 'http://localhost:3000'

  async function addClient(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const body = { name, company, email };
      const response = await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        console.error("[5] Server returned invalid JSON");
        return;
      }
      if (!response.ok) {
        console.error("[ERROR] Server error:", data);
        return;
      }

      setClients((prev) => [...prev, data.savedClient]);

      setName("");
      setCompany("");
      setEmail("");
      setIsOpen(false);



    } catch (error) {
      console.error("[FETCH ERROR]", error);
    }
  }

  async function deleteClient(clientId: number) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/clients/${clientId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Delete error:", data);
        return;
      }

      setClients((prev) =>
        prev.filter((client) => client.id !== clientId)
      );

      console.log("Client deleted successfully!");
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
  async function updateClient(clientId: number) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/clients/${clientId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, company, email }),
    });

    if (!response.ok) {
      console.error("Update failed");
      return;
    }

    const updatedClient = await response.json();

    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId ? updatedClient : client
      )
    );

    setIsEditOpen(false);
  }
  function changeClientData(clientId: number) {
    const client = clients.find((c) => c.id === clientId);

    if (!client) return;

    setEditingClientId(clientId);
    setName(client.name);
    setCompany(client.company);
    setEmail(client.email);
    setIsEditOpen(true);
  }

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          <span className="logo-icon">N</span>
          <span>NORTHSTAR</span>
        </div>

        <div className="workspace-selector">
          <div className="workspace-icon">N</div>
          <div>
            <strong>Nexus workspace</strong>
            <small>Personal workspace</small>
          </div>
          <span className="workspace-arrow">⌄</span>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">WORKSPACE</p>

          <nav className="sidebar-nav">
            <div
              className={`sidebar-link ${currentPage === "dashboard" ? "active" : ""}`}
              onClick={() => setCurrentPage("dashboard")}
            >
              <span>▦</span>
              Dashboard
            </div>

            <div
              className={`sidebar-link ${currentPage === "clients" ? "active" : ""}`}
              onClick={() => setCurrentPage("clients")}
            >
              <span>♧</span>
              Clients
            </div>

            <div
              className={`sidebar-link ${currentPage === "projects" ? "active" : ""}`}
              onClick={() => setCurrentPage("projects")}
            >
              <span>▣</span>
              Projects
            </div>

            <div className="sidebar-link">
              <span>✓</span>
              Tasks
            </div>

            <div className="sidebar-link">
              <span>◷</span>
              Finance
            </div>
          </nav>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">PREFERENCES</p>

          <nav className="sidebar-nav">
            <div className="sidebar-link">
              <span>⚙</span>
              Settings
            </div>
          </nav>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">{user?.username.charAt(0).toUpperCase()}</div>

          <div className="profile-info">
            <strong>{user?.username}</strong>
            <small>Workspace admin</small>
          </div>

          <span className="profile-menu">•••</span>
        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* HEADER */}
        <header className="dashboard-header">

          <div className="breadcrumb">
            Workspace <span>/</span> {currentPage === "projects" ? "Projects" : currentPage === "clients" ? "Clients" : "Dashboard"}
          </div>

          <div className="header-actions">
            <button className="notification-button">♧</button>

            <div className="header-user">
              <div className="header-avatar">{user?.username.charAt(0).toUpperCase()}</div>
              <span>{user?.username}</span>
            </div>

            <button
              className="logout-button"
              onClick={() => {
                setIsLoggedIn(false);
                setUser(null);
                setClients([]);
                localStorage.removeItem("token");
              }}
            >
              Logout
            </button>
          </div>

        </header>


        {/* CONTENT */}
        {currentPage === "projects" ? (
          <Projects />
        ) : currentPage === "clients" ? (
        <section className="dashboard-content">

          {/* WELCOME */}
          <div className="dashboard-welcome">

            <div>
              <span className="welcome-label">OVERVIEW</span>
              <h1>Good morning, {user?.username}</h1>
              <p>Here's what's happening with your workspace today.</p>
            </div>

            <button
              className="add-client-button"
              onClick={() => setIsOpen(true)}
            >
              <span>+</span>
              Add client
            </button>

          </div>


          {/* STATISTICS */}
          <div className="dashboard-stats">

            <div className="dashboard-stat-card">

              <div className="stat-top">
                <span>Total clients</span>
                <div className="stat-icon blue">♧</div>
              </div>

              <h2>{clients.length}</h2>

              <p className="stat-description">
                Clients in your workspace
              </p>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-top">
                <span>Active clients</span>
                <div className="stat-icon green">✓</div>
              </div>

              <h2>{clients.length}</h2>

              <p className="stat-description">
                Registered client records
              </p>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-top">
                <span>Workspace status</span>
                <div className="stat-icon purple">◈</div>
              </div>

              <h2 className="status-value">Active</h2>

              <p className="stat-description">
                Your workspace is running
              </p>

            </div>

          </div>


          {/* MAIN GRID */}
          <div className="dashboard-grid">

            {/* CLIENTS */}
            <div className="dashboard-panel clients-panel">

              <div className="panel-header">

                <div>
                  <h2>My clients</h2>
                  <p>Manage your client relationships.</p>
                </div>

                <button
                  className="view-all-button"
                  onClick={() => setIsOpen(true)}
                >
                  + Add client
                </button>

              </div>


              {clients.length === 0 ? (

                <div className="clients-empty">

                  <div className="empty-icon">♧</div>

                  <h3>No clients yet</h3>

                  <p>
                    Your client list is empty.
                    Add your first client to get started.
                  </p>

                  <button onClick={() => setIsOpen(true)}>
                    + Add your first client
                  </button>

                </div>

              ) : (

                <div className="clients-table-wrapper">

                  <table className="clients-table">

                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Company</th>
                        <th>Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>

                      {clients.map((client) => (

                        <tr key={client.id}>

                          <td>
                            <div className="client-name">
                              <div className="client-avatar">
                                {client.name?.charAt(0).toUpperCase()}
                              </div>

                              <strong>{client.name}</strong>
                            </div>
                          </td>

                          <td>{client.company}</td>

                          <td>{client.email}</td>

                          <td>
                            <button
                              className="delete-button"
                              onClick={() => deleteClient(client.id)}
                            >
                              Delete
                            </button>
                            <button onClick={() => changeClientData(client.id)}>
                              Edit
                            </button>


                            {isEditOpen && (
                              <div className="modal-overlay">
                                <div className="client-modal">

                                  <div className="modal-header">
                                    <h2>Edit client</h2>

                                    <button
                                      type="button"
                                      onClick={() => setIsEditOpen(false)}
                                    >
                                      ×
                                    </button>
                                  </div>

                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();

                                      if (editingClientId !== null) {
                                        updateClient(editingClientId);
                                      }
                                    }}
                                  >
                                    <label>Name</label>
                                    <input
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                      required
                                    />

                                    <label>Company</label>
                                    <input
                                      value={company}
                                      onChange={(e) => setCompany(e.target.value)}
                                      required
                                    />

                                    <label>Email</label>
                                    <input
                                      type="email"
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      required
                                    />

                                    <button type="submit" className="modal-submit">
                                      Обновить
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setIsEditOpen(false)}
                                    >
                                      Отмена
                                    </button>
                                  </form>

                                </div>
                              </div>
                            )}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </div>


            {/* RIGHT PANEL */}
            <div className="dashboard-panel overview-panel">

              <div className="panel-header">
                <div>
                  <h2>Workspace overview</h2>
                  <p>Your workspace at a glance.</p>
                </div>
              </div>

              <div className="overview-item">
                <div className="overview-item-icon blue">♧</div>

                <div>
                  <strong>Client management</strong>
                  <p>Keep your contacts organized.</p>
                </div>
              </div>

              <div className="overview-item">
                <div className="overview-item-icon green">✓</div>

                <div>
                  <strong>Workspace ready</strong>
                  <p>Your CRM is ready to use.</p>
                </div>
              </div>

              <div className="overview-divider"></div>

              <div className="overview-summary">
                <span>Total client records</span>
                <strong>{clients.length}</strong>
              </div>

              <button
                className="overview-add-button"
                onClick={() => setIsOpen(true)}
              >
                Manage clients →
              </button>

            </div>

          </div>

        </section>
        ) : null}

      </main>


      {/* ADD CLIENT MODAL */}
      {isOpen && (

        <div
          className="modal-overlay"
          onClick={() => setIsOpen(false)}
        >

          <div
            className="client-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <h2>Add new client</h2>
                <p>Enter the details of your new client.</p>
              </div>

              <button
                className="close-button"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>

            </div>


            <form onSubmit={addClient}>

              <label>Client name</label>

              <input
                type="text"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />


              <label>Company</label>

              <input
                type="text"
                placeholder="Company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />


              <label>Email address</label>

              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />


              <button className="modal-submit" type="submit">
                Add client
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;
