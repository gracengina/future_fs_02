import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import LeadModal from '../components/leadmodel';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clears session
    navigate('/login');
  };

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await API.get('/leads'); //
        setLeads(res.data);
      } catch (err) {
        console.error("Fetch error", err);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar - Fixed Left */}
      <aside className="sidebar">
        <div className="sidebar-brand">CRM Admin</div>
        <nav className="sidebar-nav">
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item">Reports</button>
        </nav>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <h1>Active Leads</h1>
          <p>You have {leads.length} leads to manage today.</p>
        </header>

        <div className="table-container">
          <table className="full-width-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="lead-row">
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>
                    <select className={`badge status-${lead.status}`}>
                        <option className="status-new" value="New">New</option>
                        <option className="status-contacted" value="Contacted">Contacted</option>
                        <option className="status-converted" value="Converted">Converted</option>
                                            </select>
                  </td>
                  <td>
                    <button className="view-btn" onClick={() => setSelectedLead(lead)}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Slide-in Modal */}
      {selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  );
};

export default Dashboard;