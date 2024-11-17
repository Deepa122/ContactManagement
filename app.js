import React, { useState, useEffect } from "react";
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Button, TablePagination, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";

const App = () => {
    const [contacts, setContacts] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [editing, setEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const fetchContacts = async () => {
        const res = await axios.get("http://localhost:5000/contacts");
        setContacts(res.data);
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleOpen = (contact) => {
        if (contact) {
            setFormData(contact);
            setEditing(true);
            setCurrentId(contact.id);
        } else {
            setFormData({});
            setEditing(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (editing) {
            await axios.put(`http://localhost:5000/contacts/${currentId}`, formData);
        } else {
            await axios.post("http://localhost:5000/contacts", formData);
        }
        fetchContacts();
        handleClose();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/contacts/${id}`);
        fetchContacts();
    };

    return (
        <Container>
            <h1>Contact Management</h1>
            <Button variant="contained" color="primary" onClick={() => handleOpen()}>Add Contact</Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Job Title</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contacts.map((contact) => (
                        <TableRow key={contact.id}>
                            <TableCell>{contact.first_name}</TableCell>
                            <TableCell>{contact.last_name}</TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>{contact.phone_number}</TableCell>
                            <TableCell>{contact.company}</TableCell>
                            <TableCell>{contact.job_title}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleOpen(contact)}>Edit</Button>
                                <Button onClick={() => handleDelete(contact.id)} color="error">Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editing ? "Edit Contact" : "Add Contact"}</DialogTitle>
                <DialogContent>
                    <TextField name="first_name" label="First Name" fullWidth margin="dense" onChange={handleChange} value={formData.first_name || ""} />
                    <TextField name="last_name" label="Last Name" fullWidth margin="dense" onChange={handleChange} value={formData.last_name || ""} />
                    <TextField name="email" label="Email" fullWidth margin="dense" onChange={handleChange} value={formData.email || ""} />
                    <TextField name="phone_number" label="Phone Number" fullWidth margin="dense" onChange={handleChange} value={formData.phone_number || ""} />
                    <TextField name="company" label="Company" fullWidth margin="dense" onChange={handleChange} value={formData.company || ""} />
                    <TextField name="job_title" label="Job Title" fullWidth margin="dense" onChange={handleChange} value={formData.job_title || ""} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">{editing ? "Update" : "Add"}</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default App;
