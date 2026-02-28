import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid, Chip, IconButton, Tooltip, Avatar
} from '@mui/material';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupsIcon from '@mui/icons-material/Groups';
import axios from 'axios';
import { toast } from 'react-toastify';

const STATUSES = ["Active", "Inactive", "Disbanded"];

const emptyForm = {
  teamName: '', teamCode: '', homeGround: '', founded: '',
  coach: '', captain: '', viceCaptain: '', description: '',
  logoUrl: '', primaryColor: '#1a73e8', status: 'Active',
  wins: 0, losses: 0, draws: 0, totalMatches: 0,
};

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchTeams = async () => {
    try {
      const { data } = await axios.get('/api/teams');
      setTeams(data.teams);
    } catch { toast.error('Failed to load teams'); }
  };

  useEffect(() => { fetchTeams(); }, []);

  const handleOpen = (row = null) => {
    if (row) { setEditId(row._id); setForm({ ...row }); }
    else { setEditId(null); setForm(emptyForm); }
    setOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`/api/teams/${editId}`, form);
        toast.success('Team updated');
      } else {
        await axios.post('/api/teams', form);
        toast.success('Team created');
      }
      setOpen(false);
      fetchTeams();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving team'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team?')) return;
    try {
      await axios.delete(`/api/teams/${id}`);
      toast.success('Team deleted');
      fetchTeams();
    } catch { toast.error('Failed to delete'); }
  };

  const columns = [
    {
      field: 'teamName', headerName: 'Team', width: 180,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: p.row.primaryColor, width: 28, height: 28, fontSize: 12 }}>{p.row.teamCode}</Avatar>
          {p.value}
        </Box>
      )
    },
    { field: 'captain', headerName: 'Captain', width: 140 },
    { field: 'coach', headerName: 'Coach', width: 130 },
    { field: 'homeGround', headerName: 'Home Ground', width: 150 },
    { field: 'wins', headerName: 'W', width: 55 },
    { field: 'losses', headerName: 'L', width: 55 },
    { field: 'draws', headerName: 'D', width: 55 },
    { field: 'totalMatches', headerName: 'Played', width: 75 },
    {
      field: 'status', headerName: 'Status', width: 90,
      renderCell: (p) => <Chip label={p.value} color={p.value === 'Active' ? 'success' : 'default'} size="small" />
    },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleOpen(p.row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(p.row._id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          <GroupsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Team Management
        </Typography>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Team</Button>
      </Box>

      <Paper sx={{ bgcolor: 'secondary.midNightBlue' }}>
        <Box sx={{ height: 450, width: '100%' }}>
          <DataGrid
            sx={{
              color: 'black',
              '& .MuiTablePagination-displayedRows': { color: 'white' },
              [`& .${gridClasses.row}`]: { bgcolor: (t) => t.palette.secondary.main },
              button: { color: '#ffffff' }
            }}
            getRowId={(row) => row._id}
            rows={teams}
            columns={columns}
            pageSize={6}
            rowsPerPageOptions={[6]}
            slots={{ toolbar: GridToolbar }}
          />
        </Box>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>{editId ? 'Edit Team' : 'Create New Team'}</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a', pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={8}><TextField fullWidth label="Team Name" name="teamName" value={form.teamName} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Team Code (max 5)" name="teamCode" value={form.teamCode} onChange={handleChange} inputProps={{ maxLength: 5 }} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Captain" name="captain" value={form.captain} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Vice Captain" name="viceCaptain" value={form.viceCaptain} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Head Coach" name="coach" value={form.coach} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Home Ground" name="homeGround" value={form.homeGround} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Founded Year" name="founded" type="number" value={form.founded} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Primary Color" name="primaryColor" type="color" value={form.primaryColor} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth select label="Status" name="status" value={form.status} onChange={handleChange}>{STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField></Grid>
            <Grid item xs={4}><TextField fullWidth label="Wins" name="wins" type="number" value={form.wins} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Losses" name="losses" type="number" value={form.losses} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Draws" name="draws" type="number" value={form.draws} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Logo URL" name="logoUrl" value={form.logoUrl} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Description" name="description" value={form.description} onChange={handleChange} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e2a3a' }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>{editId ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamManagement;
