import { useEffect, useState } from "react";
import "./App.css";
import Login from "./login";
interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
}

function App() {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem("clients");
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
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

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">
          <span>N</span> nexus
        </h2>

        <div className="workspace">
          Nexus workspace
          <small>Personal workspace</small>
        </div>

        <p className="menu-title">WORKSPACE</p>

        <nav>
          <div className="nav-item active">▦ Dashboard</div>
          <div className="nav-item">♧ Clients</div>
          <div className="nav-item">▣ Settings</div>
        </nav>

        <div className="profile">
          <div className="avatar">A</div>
          <div>
            Alex Morgan
            <small>Workspace admin</small>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">

        <header className="header">
          <span>Workspace / Dashboard</span>
          <div className="user">Alex Morgan</div>
        </header>
        <button
          className="logout-button"
          onClick={() => {
            setIsLoggedIn(false);
            localStorage.removeItem("token");
          }}
        >
          Logout
        </button>

        <section className="content">

          <div className="welcome">
            <div>
              <h1>Good morning, Alex</h1>
              <p>Here's what's happening with your business today.</p>
            </div>

            <button
              className="add-button"
              onClick={() => setIsOpen(true)}
            >
              + Add Client
            </button>
          </div>

          {/* STATISTICS */}
          <div className="stats">

            <div className="stat-card">
              <p>Total Clients</p>
              <h2>{clients.length}</h2>
            </div>

            <div className="stat-card">
              <p>Active Clients</p>
              <h2>{clients.length}</h2>
            </div>

          </div>

          {/* CLIENTS */}
          <div className="clients-section">

            <div className="section-header">
              <div>
                <h2>My Clients</h2>
                <p>Your latest client relationships.</p>
              </div>

              <span>{clients.length} clients</span>
            </div>

            {clients.length === 0 ? (
              <div className="empty">
                <h3>No clients yet</h3>
                <p>Add your first client to get started.</p>

                <button onClick={() => setIsOpen(true)}>
                  + Add your first client
                </button>
              </div>
            ) : (
              <div className="client-list">

                <div className="client-row table-header">
                  <span>Name</span>
                  <span>Company</span>
                  <span>Email</span>
                  <span>Action</span>
                </div>

                {clients.map((client) => (
                  <div className="client-row" key={client.id}>

                    <span>{client.name}</span>
                    <span>{client.company}</span>
                    <span>{client.email}</span>

                    <button
                      className="delete-button"
                      onClick={()=>deleteClient(client.id)}

                    >
                      Delete
                    </button>

                  </div>
                ))}

              </div>
            )}

          </div>

        </section>
      </main>

      {/* ADD CLIENT MODAL */}
      {isOpen && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">
              <h2>Add new client</h2>

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

              <label>Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button className="submit-button" type="submit">
                Add Client
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;