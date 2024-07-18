"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNoteId, setCurrentNoteId] = useState(null);
    const [formData, setFormData] = useState({ title: '', note: '', date: '', priority: '', category: '' });
    const router = useRouter();

    useEffect(() => {
        async function fetchNotes() {
            const response = await fetch('/api/notes/getNote');
            if (response.ok) {
                const data = await response.json();
                setNotes(data);
            } else {
                console.error('Failed to fetch notes');
            }
        }

        fetchNotes();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        const { title, note, date, priority, category } = formData;

        if (isEditing) {
            try {
                const response = await fetch(`/api/notes/updateNote/${currentNoteId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, note, date, priority, category }),
                });
                if (response.ok) {
                    const updatedNote = await response.json();
                    setNotes(notes.map(n => n.id === currentNoteId ? updatedNote : n));
                    setIsEditing(false);
                    setCurrentNoteId(null);
                } else {
                    console.error('Failed to update note');
                }
            } catch (error) {
                console.error("Error updating note", error);
            }
        } else {
            try {
                const response = await fetch('/api/notes/postNote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, note, date, priority, category }),
                });
                if (response.ok) {
                    const newNote = await response.json();
                    setNotes([...notes, newNote]);
                } else {
                    console.error('Failed to create note');
                }
            } catch (error) {
                console.error("Error creating note", error);
            }
        }

        setFormData({ title: '', note: '', date: '', priority: '', category: '' });
    }

    async function deleteNoteHandler(id) {
        try {
            const response = await fetch(`/api/notes/deleteNote/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setNotes(notes.filter(note => note.id !== id));
            } else {
                console.error('Failed to delete note');
            }
        } catch (error) {
            console.error("Error deleting note", error);
        }
    }

    function editNoteHandler(note) {
        setIsEditing(true);
        setCurrentNoteId(note.id);
        setFormData({ title: note.title, note: note.note, date: note.date, priority: note.priority, category: note.category });
    }

    return (
        <main className="m-10">
            <div className="m-5">
                <h1 className="text-center m-5">{isEditing ? 'Edit Note' : 'Add Note'}</h1>
            </div>  
            <form onSubmit={handleSubmit} className="space-y-5">
                <input 
                    type="text" 
                    id="title"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="shadow-lg rounded-md shadow-black h-10 p-3 w-[100%]"
                />
                <input 
                    type="text" 
                    id="note"
                    name="note"
                    placeholder="Add Note"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="shadow-lg rounded-md shadow-black h-10 p-3 w-[100%]"
                />
                <input 
                    type="date" 
                    id="date"
                    name="date"
                    placeholder="Add Date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="shadow-lg rounded-md shadow-black h-10 p-3 w-[100%]"
                />
                <input 
                    type="text" 
                    id="priority"
                    name="priority"
                    placeholder="Priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="shadow-lg rounded-md shadow-black h-10 p-3 w-[100%]"
                />
                <input 
                    type="text" 
                    id="category"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="shadow-lg rounded-md shadow-black h-10 p-3 w-[100%]"
                />
                <button className="bg-orange-500 font-bold text-white hover:bg-red-600 p-3 rounded-md">
                    Submit
                </button>
            </form>
            <div>
                <h1 className="text-center font-bold m-5 mb-5">Display Note</h1>
            </div>
            {
                notes.map((element) => (
                    <ul className="flex my-2" key={element.id}>
                        <li className="text-center w-[20%]">{element.title}</li>
                        <li className="text-center w-[20%]">{element.note}</li>
                        <li className="text-center w-[15%]">{new Date(element.date).toLocaleDateString()}</li>
                        <li className="text-center w-[15%]">{element.priority}</li>
                        <li className="text-center w-[15%]">{element.category}</li>
                        <li className="flex text-center w-[15%]">
                            <button onClick={() => editNoteHandler(element)} className="bg-red-400 font-bold text-white mr-2">
                                EDIT
                            </button> 
                            <button onClick={() => deleteNoteHandler(element.id)} className="bg-red-600 font-bold text-white">
                                DELETE
                            </button>
                        </li>
                    </ul>
                ))
            }
        </main>
    );
}
