import { useEffect, useState } from "react";
import "./Settings.css";

interface SettingsValues {
  workspaceName: string;
  workspaceDescription: string;
  createdDate: string;
  theme: "Light" | "Dark";
  language: string;
  emailAddress: string;
  provider: "Gmail" | "Outlook" | "Custom";
  smtpHost: string;
  smtpPort: string;
  imapHost: string;
  imapPort: string;
}

const defaults: SettingsValues = {
  workspaceName: "Northstar CRM",
  workspaceDescription: "",
  createdDate: "",
  theme: "Dark",
  language: "English",
  emailAddress: "",
  provider: "Gmail",
  smtpHost: "",
  smtpPort: "587",
  imapHost: "",
  imapPort: "993",
};

function Settings() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [values, setValues] = useState<SettingsValues>(() => {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem("crm_settings") ?? "{}") };
    } catch {
      return defaults;
    }
  });
  const [saved, setSaved] = useState(false);
  const [mailMessage, setMailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") ?? "");
    setEmail(localStorage.getItem("email") ?? "");
  }, []);

  function update<Key extends keyof SettingsValues>(key: Key, value: SettingsValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem("crm_settings", JSON.stringify(values));
    setSaved(true);
  }

  function testEmailConnection() {
    setMailMessage("Email connection testing requires a configured mail backend.");
  }
return (
    <section className="settings-page">
      <header className="settings-heading">
        <h1>Settings for, {username}, {email}</h1>
        <p>Manage your workspace preferences and configurations.</p>
      </header>

      <form className="settings-form" onSubmit={save}>
        <section className="settings-section">
          <div className="settings-section-heading">
            <span className="settings-section-icon">👤</span>
            <div>
              <h2>Profile</h2>
              <p>Manage your personal account details.</p>
            </div>
          </div>
          <div className="settings-fields">
            <label className="settings-field">
              <span>Username</span>
              <input value={username} readOnly />
            </label>
            <label className="settings-field">
              <span>Email</span>
              <input type="email" value={email} readOnly placeholder="you@example.com" />
            </label>
            <div className="settings-field settings-avatar-field">
              <span>Avatar</span>
              <div className="settings-avatar-row">
                <div className="settings-avatar">{username.charAt(0).toUpperCase() || "?"}</div>
                <span>Avatar upload can be added later.</span>
              </div>
            </div>
            <div className="settings-field">
              <span>Password</span>
              <button className="settings-secondary-button" type="button" onClick={() => setPasswordMessage("Password changes are not connected yet.")}>Change password</button>
              {passwordMessage && <span className="settings-inline-message" role="status">{passwordMessage}</span>}
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-heading">
            <span className="settings-section-icon">🏢</span>
            <div>
              <h2>Workspace</h2>
              <p>Set the name and details for your workspace.</p>
            </div>
          </div>
          <div className="settings-fields">
            <label className="settings-field">
              <span>Workspace name</span>
              <input value={values.workspaceName} onChange={(event) => update("workspaceName", event.target.value)} />
            </label>
            <label className="settings-field">
              <span>Workspace description</span>
              <textarea value={values.workspaceDescription} onChange={(event) => update("workspaceDescription", event.target.value)} rows={3} />
            </label>
            <label className="settings-field">
              <span>Created date</span>
              <input value={values.createdDate || "Not set"} readOnly />
            </label>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-heading">
            <span className="settings-section-icon">🎨</span>
            <div>
              <h2>Appearance</h2>
              <p>Choose how the workspace looks.</p>
            </div>
          </div>
          <div className="settings-fields settings-fields-inline">
            <label className="settings-field">
              <span>Theme</span>
              <select value={values.theme} onChange={(event) => update("theme", event.target.value as SettingsValues["theme"])}>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </label>
            <label className="settings-field">
              <span>Language</span>
              <select value={values.language} onChange={(event) => update("language", event.target.value)}>
                <option>English</option>
              </select>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-heading">
            <span className="settings-section-icon">✉️</span>
            <div>
              <h2>Email Accounts</h2>
              <p>Configure an email account for your workspace.</p>
            </div>
          </div>
          <div className="settings-fields">
            <label className="settings-field">
              <span>Email address</span>
              <input type="email" value={values.emailAddress} onChange={(event) => update("emailAddress", event.target.value)} placeholder="name@example.com" />
            </label>
            <label className="settings-field">
              <span>Provider</span>
              <select value={values.provider} onChange={(event) => update("provider", event.target.value as SettingsValues["provider"])}>
                <option>Gmail</option>
                <option>Outlook</option>
                <option>Custom</option>
              </select>
            </label>
            <div className="settings-subheading">SMTP configuration</div>
            <label className="settings-field">
              <span>SMTP host</span>
              <input value={values.smtpHost} onChange={(event) => update("smtpHost", event.target.value)} placeholder="smtp.example.com" />
            </label>
            <label className="settings-field">
              <span>SMTP port</span>
              <input value={values.smtpPort} onChange={(event) => update("smtpPort", event.target.value)} inputMode="numeric" />
            </label>
            <div className="settings-subheading">IMAP configuration</div>
            <label className="settings-field">
              <span>IMAP host</span>
              <input value={values.imapHost} onChange={(event) => update("imapHost", event.target.value)} placeholder="imap.example.com" />
            </label>
            <label className="settings-field">
              <span>IMAP port</span>
              <input value={values.imapPort} onChange={(event) => update("imapPort", event.target.value)} inputMode="numeric" />
            </label>
            <div className="settings-mail-status">
              <span className="settings-status-dot" />
              Connection status: Not connected
            </div>
            {mailMessage && <p className="settings-mail-message" role="status">{mailMessage}</p>}
            <div className="settings-mail-actions">
              <button className="settings-secondary-button" type="button" onClick={testEmailConnection}>Test connection</button>
              <button className="settings-secondary-button" type="button" onClick={() => setMailMessage("No email account is connected.")}>Disconnect account</button>
            </div>
          </div>
        </section>

        <footer className="settings-footer">
          <button className="settings-save-button" type="submit">{saved ? "Changes saved" : "Save Changes"}</button>
        </footer>
      </form>
    </section>
  );
}

export default Settings;
