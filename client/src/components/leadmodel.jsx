import React, { useState, useEffect } from 'react';
import API from '../services/api';
import '../App.css'; 

const LeadModal = ({ lead, onClose }) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await API.get(`/admin/notes/${lead.id}`);
                setNotes(res.data);
            } catch (err) {
                console.error("Error fetching notes", err);
            }
        };
        fetchNotes();
    }, [lead.id]);

    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            await API.post(`admin/notes/${lead.id}`, { content: newNote });
            setNotes([{ 
                content: newNote, 
                admin_name: "Me", 
                created_at: new Date() 
            }, ...notes]);
            setNewNote(""); 
        } catch (err) {
            alert("Could not save note.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content lead-notes-container">
                <button className="close-btn" onClick={onClose} style={{width:"20px"}}>&times; </button>
                
                <h2>Lead: {lead.name}</h2>
                <div className="lead-info">
                    <p><strong>Contact:</strong> {lead.email} | {lead.phone}</p>
                    <p><strong>Source:</strong> {lead.source}</p>
                </div>
                <hr />

                <h3>Interaction History</h3>
                <div className="notes-list">
                    {notes.length > 0 ? notes.map((note, index) => (
                        <div key={index} className="note-item">
                            <small>{new Date(note.created_at).toLocaleString()} - <strong>{note.admin_name}</strong></small>
                            <p>{note.content}</p>
                        </div>
                    )) : <p>No notes found for this lead.</p>}
                </div>

                {/* Updated Form Structure */}
                <form onSubmit={handleAddNote} className="note-form">
                    <textarea 
                        className="lead-notes-textarea"
                        value={newNote} 
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Type a new follow-up note..."
                        required
                    />
                    <button type="submit" className="save-note-btn">
                        Save Note
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LeadModal;