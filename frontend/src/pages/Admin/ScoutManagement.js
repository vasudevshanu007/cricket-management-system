import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid, Chip, IconButton, Tooltip,
  Card, CardContent, Rating, LinearProgress
} from '@mui/material';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import { toast } from 'react-toastify';

const BATTING_STYLES = ["Right-handed", "Left-handed", "N/A"];
const BOWLING_STYLES = ["Right-arm Fast", "Right-arm Medium", "Right-arm Spin", "Left-arm Fast", "Left-arm Medium", "Left-arm Spin", "N/A"];
const POSITIONS = ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"];
const STATUSES = ["New", "Under Review", "Shortlisted", "Trial Scheduled", "Rejected", "Contracted"];
const GRADES = ["A", "B", "C", "D"];
const RECOMMENDED_FOR = ["First Team", "U19", "U16", "Academy", "Reserves", "Support Staff"];

const emptyForm = {
  playerName: '', age: '', contactNumber: '', email: '', location: '',
  battingStyle: 'Right-handed', bowlingStyle: 'N/A', preferredPosition: 'Batsman',
  scoutedBy: '', scoutingDate: '', grade: 'C', status: 'New',
  recommendedFor: 'Academy', strengths: '', weaknesses: '',
  overallRating: 5, trialDate: '', videoUrl: '', notes: '',
};

const statusColor = {
  New: 'default', 'Under Review': 'info', Shortlisted: 'warning',
  'Trial Scheduled': 'primary', Rejected: 'error', Contracted: 'success',
};
const gradeColor = { A: '#2e7d32', B: '#1565c0', C: '#e65100', D: '#c62828' };

const ScoutManagement = () => {
  const [scouts, setScouts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, shortlisted: 0, contracted: 0, trialScheduled: 0 });

  const fetchScouts = async () => {
    try {
      const { data } = await axios.get('/api/scouts');
      setScouts(data.scouts);
      setStats({
        total: data.scouts.length,
        shortlisted: data.scouts.filter(s => s.status === 'Shortlisted').length,
        trialScheduled: data.scouts.filter(s => s.status === 'Trial Scheduled').length,
        contracted: data.scouts.filter(s => s.status === 'Contracted').length,
      });
    } catch { toast.error('Failed to load scouts'); }
  };

  useEffect(() => { fetchScouts(); }, []);

  const handleOpen = (row = null) => {
    if (row) {
      setEditId(row._id);
      setForm({
        ...row,
        scoutingDate: row.scoutingDate ? row.scoutingDate.substring(0, 10) : '',
        trialDate: row.trialDate ? row.trialDate.substring(0, 10) : '',
      });
    } else { setEditId(null); setForm(emptyForm); }
    setOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) { await axios.put(`/api/scouts/${editId}`, form); toast.success('Scout record updated'); }
      else { await axios.post('/api/scouts', form); toast.success('Scout added to pipeline'); }
      setOpen(false);
      fetchScouts();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving record'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this scout from pipeline?')) return;
    try {
      await axios.delete(`/api/scouts/${id}`);
      toast.success('Scout removed');
      fetchScouts();
    } catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { field: 'playerName', headerName: 'Player', width: 150 },
    { field: 'age', headerName: 'Age', width: 60 },
    { field: 'preferredPosition', headerName: 'Position', width: 120 },
    { field: 'location', headerName: 'Location', width: 120 },
    {
      field: 'grade', headerName: 'Grade', width: 75,
      renderCell: (p) => (
        <Chip label={p.value} size="small" sx={{ bgcolor: gradeColor[p.value] || '#37474f', color: 'white', fontWeight: 700 }} />
      )
    },
    {
      field: 'overallRating', headerName: 'Rating', width: 110,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <StarIcon sx={{ color: '#ffd700', fontSize: 16 }} />
          <Typography variant="body2" sx={{ color: 'white' }}>{p.value}/10</Typography>
        </Box>
      )
    },
    { field: 'recommendedFor', headerName: 'Recommended', width: 120 },
    {
      field: 'status', headerName: 'Status', width: 135,
      renderCell: (p) => <Chip label={p.value} color={statusColor[p.value] || 'default'} size="small" />
    },
    { field: 'scoutedBy', headerName: 'Scouted By', width: 120 },
    {
      field: 'actions', headerName: 'Actions', width: 110, sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleOpen(p.row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Remove"><IconButton size="small" color="error" onClick={() => handleDelete(p.row._id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          <PersonSearchIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Player Scouting
        </Typography>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Scout</Button>
      </Box>

      {/* Stats Row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { label: 'Total Pipeline', count: stats.total, color: '#1565c0' },
          { label: 'Shortlisted', count: stats.shortlisted, color: '#e65100' },
          { label: 'Trial Scheduled', count: stats.trialScheduled, color: '#6a1b9a' },
          { label: 'Contracted', count: stats.contracted, color: '#2e7d32' },
        ].map(({ label, count, color }) => (
          <Grid item xs={6} md={3} key={label}>
            <Card sx={{ bgcolor: color }}>
              <CardContent sx={{ py: 1.5 }}>
                <Typography variant="h4" fontWeight={700} color="white">{count}</Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.8)">{label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ bgcolor: 'secondary.midNightBlue' }}>
        <Box sx={{ height: 450, width: '100%' }}>
          <DataGrid
            sx={{
              color: 'black',
              '& .MuiTablePagination-displayedRows': { color: 'white' },
              [`& .${gridClasses.row}`]: { bgcolor: (t) => t.palette.secondary.main },
              button: { color: '#ffffff' },
            }}
            getRowId={(row) => row._id}
            rows={scouts}
            columns={columns}
            pageSize={6}
            rowsPerPageOptions={[6]}
            slots={{ toolbar: GridToolbar }}
          />
        </Box>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>{editId ? 'Edit Scout Record' : 'Add Player to Pipeline'}</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a', pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6}><TextField fullWidth label="Player Name" name="playerName" value={form.playerName} onChange={handleChange} /></Grid>
            <Grid item xs={3}><TextField fullWidth label="Age" name="age" type="number" value={form.age} onChange={handleChange} /></Grid>
            <Grid item xs={3}>
              <TextField fullWidth select label="Grade" name="grade" value={form.grade} onChange={handleChange}>
                {GRADES.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}><TextField fullWidth label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Location / City" name="location" value={form.location} onChange={handleChange} /></Grid>
            <Grid item xs={6}>
              <TextField fullWidth select label="Preferred Position" name="preferredPosition" value={form.preferredPosition} onChange={handleChange}>
                {POSITIONS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth select label="Batting Style" name="battingStyle" value={form.battingStyle} onChange={handleChange}>
                {BATTING_STYLES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth select label="Bowling Style" name="bowlingStyle" value={form.bowlingStyle} onChange={handleChange}>
                {BOWLING_STYLES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={4}><TextField fullWidth label="Overall Rating (1–10)" name="overallRating" type="number" inputProps={{ min: 1, max: 10 }} value={form.overallRating} onChange={handleChange} /></Grid>
            <Grid item xs={4}>
              <TextField fullWidth select label="Status" name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth select label="Recommended For" name="recommendedFor" value={form.recommendedFor} onChange={handleChange}>
                {RECOMMENDED_FOR.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={4}><TextField fullWidth label="Scouted By" name="scoutedBy" value={form.scoutedBy} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Scouting Date" name="scoutingDate" type="date" value={form.scoutingDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Trial Date" name="trialDate" type="date" value={form.trialDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={6}><TextField fullWidth multiline rows={2} label="Strengths" name="strengths" value={form.strengths} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth multiline rows={2} label="Weaknesses" name="weaknesses" value={form.weaknesses} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Video / Highlight URL" name="videoUrl" value={form.videoUrl} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Notes" name="notes" value={form.notes} onChange={handleChange} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e2a3a' }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>{editId ? 'Update' : 'Add to Pipeline'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScoutManagement;
