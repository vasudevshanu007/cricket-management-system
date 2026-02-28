import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid, Chip, IconButton, Tooltip,
  Card, CardContent, LinearProgress
} from '@mui/material';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HealingIcon from '@mui/icons-material/Healing';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import axios from 'axios';
import { toast } from 'react-toastify';

const INJURY_TYPES = [
  "Muscle Strain", "Fracture", "Sprain", "Dislocation", "Contusion",
  "Tendinitis", "Stress Fracture", "Ligament Tear", "Hamstring",
  "Back Injury", "Shoulder Injury", "Knee Injury", "Ankle Injury",
  "Wrist Injury", "Concussion", "Other"
];
const SEVERITIES = ["Minor", "Moderate", "Severe", "Career-threatening"];
const STATUSES = ["Injured", "Recovering", "Fit", "Under Observation"];

const emptyForm = {
  playerName: '', playerEmail: '', playerId: '', injuryType: 'Muscle Strain',
  bodyPart: '', severity: 'Minor', injuryDate: '', expectedRecoveryDate: '',
  actualRecoveryDate: '', status: 'Injured', doctor: '', hospital: '',
  treatment: '', missedMatches: 0, availableForSelection: false, notes: '',
};

const severityColor = { Minor: 'success', Moderate: 'warning', Severe: 'error', 'Career-threatening': 'error' };
const statusColor = { Injured: 'error', Recovering: 'warning', Fit: 'success', 'Under Observation': 'info' };

const InjuryTracker = () => {
  const [injuries, setInjuries] = useState([]);
  const [activeInjuries, setActiveInjuries] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchInjuries = async () => {
    try {
      const [allRes, activeRes] = await Promise.all([
        axios.get('/api/injuries'),
        axios.get('/api/injuries/active'),
      ]);
      setInjuries(allRes.data.injuries);
      setActiveInjuries(activeRes.data.injuries);
    } catch { toast.error('Failed to load injury records'); }
  };

  useEffect(() => { fetchInjuries(); }, []);

  const handleOpen = (row = null) => {
    if (row) {
      setEditId(row._id);
      setForm({
        ...row,
        injuryDate: row.injuryDate ? row.injuryDate.substring(0, 10) : '',
        expectedRecoveryDate: row.expectedRecoveryDate ? row.expectedRecoveryDate.substring(0, 10) : '',
        actualRecoveryDate: row.actualRecoveryDate ? row.actualRecoveryDate.substring(0, 10) : '',
      });
    } else { setEditId(null); setForm(emptyForm); }
    setOpen(true);
  };

  const handleChange = (e) => {
    const val = e.target.name === 'availableForSelection' ? e.target.value === 'true' : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) { await axios.put(`/api/injuries/${editId}`, form); toast.success('Record updated'); }
      else { await axios.post('/api/injuries', form); toast.success('Injury recorded'); }
      setOpen(false);
      fetchInjuries();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving record'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this injury record?')) return;
    try {
      await axios.delete(`/api/injuries/${id}`);
      toast.success('Record deleted');
      fetchInjuries();
    } catch { toast.error('Failed to delete'); }
  };

  const fitCount = injuries.filter(i => i.status === 'Fit').length;
  const injuredCount = injuries.filter(i => i.status === 'Injured').length;
  const recoveringCount = injuries.filter(i => i.status === 'Recovering').length;

  const columns = [
    { field: 'playerName', headerName: 'Player', width: 140 },
    { field: 'injuryType', headerName: 'Injury', width: 150 },
    { field: 'bodyPart', headerName: 'Body Part', width: 120 },
    {
      field: 'severity', headerName: 'Severity', width: 110,
      renderCell: (p) => <Chip label={p.value} color={severityColor[p.value] || 'default'} size="small" />
    },
    { field: 'injuryDate', headerName: 'Injured', width: 100, renderCell: (p) => p.value ? new Date(p.value).toLocaleDateString() : '-' },
    { field: 'expectedRecoveryDate', headerName: 'Expected Recovery', width: 145, renderCell: (p) => p.value ? new Date(p.value).toLocaleDateString() : '-' },
    {
      field: 'status', headerName: 'Status', width: 130,
      renderCell: (p) => <Chip label={p.value} color={statusColor[p.value] || 'default'} size="small" />
    },
    { field: 'missedMatches', headerName: 'Missed', width: 80 },
    {
      field: 'availableForSelection', headerName: 'Available', width: 90,
      renderCell: (p) => <Chip label={p.value ? 'Yes' : 'No'} color={p.value ? 'success' : 'error'} size="small" variant="outlined" />
    },
    {
      field: 'actions', headerName: 'Actions', width: 110, sortable: false,
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          <HealingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Injury Tracker
        </Typography>
        <Button variant="contained" color="error" startIcon={<AddIcon />} onClick={() => handleOpen()}>Log Injury</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { label: 'Injured', count: injuredCount, color: '#c62828', icon: <HealingIcon /> },
          { label: 'Recovering', count: recoveringCount, color: '#e65100', icon: <FitnessCenterIcon /> },
          { label: 'Fit', count: fitCount, color: '#2e7d32', icon: <FitnessCenterIcon /> },
          { label: 'Total Records', count: injuries.length, color: '#1565c0', icon: <HealingIcon /> },
        ].map(({ label, count, color, icon }) => (
          <Grid item xs={6} md={3} key={label}>
            <Card sx={{ bgcolor: color, color: 'white' }}>
              <CardContent sx={{ py: 1.5 }}>
                <Typography variant="h4" fontWeight={700}>{count}</Typography>
                <Typography variant="body2">{label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {activeInjuries.length > 0 && (
        <Card sx={{ bgcolor: '#1a0a0a', border: '1px solid #c62828', mb: 2 }}>
          <CardContent sx={{ py: 1.5 }}>
            <Typography color="error.light" fontWeight={600} gutterBottom>Currently Unavailable Players</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {activeInjuries.map(i => (
                <Chip key={i._id} label={`${i.playerName} (${i.injuryType})`}
                  color={i.status === 'Injured' ? 'error' : 'warning'} size="small" />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

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
            rows={injuries}
            columns={columns}
            pageSize={6}
            rowsPerPageOptions={[6]}
            slots={{ toolbar: GridToolbar }}
          />
        </Box>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>{editId ? 'Edit Injury Record' : 'Log New Injury'}</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a', pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6}><TextField fullWidth label="Player Name" name="playerName" value={form.playerName} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Player Email" name="playerEmail" value={form.playerEmail} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth select label="Injury Type" name="injuryType" value={form.injuryType} onChange={handleChange}>{INJURY_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}</TextField></Grid>
            <Grid item xs={6}><TextField fullWidth label="Body Part" name="bodyPart" value={form.bodyPart} onChange={handleChange} placeholder="e.g. Left Knee" /></Grid>
            <Grid item xs={6}><TextField fullWidth select label="Severity" name="severity" value={form.severity} onChange={handleChange}>{SEVERITIES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField></Grid>
            <Grid item xs={6}><TextField fullWidth select label="Status" name="status" value={form.status} onChange={handleChange}>{STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField></Grid>
            <Grid item xs={4}><TextField fullWidth label="Injury Date" name="injuryDate" type="date" value={form.injuryDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Expected Recovery" name="expectedRecoveryDate" type="date" value={form.expectedRecoveryDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Actual Recovery" name="actualRecoveryDate" type="date" value={form.actualRecoveryDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Doctor / Physio" name="doctor" value={form.doctor} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Hospital / Clinic" name="hospital" value={form.hospital} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Missed Matches" name="missedMatches" type="number" value={form.missedMatches} onChange={handleChange} /></Grid>
            <Grid item xs={4}>
              <TextField fullWidth select label="Available for Selection" name="availableForSelection" value={String(form.availableForSelection)} onChange={handleChange}>
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Treatment Notes" name="treatment" value={form.treatment} onChange={handleChange} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e2a3a' }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleSubmit} disabled={loading}>{editId ? 'Update' : 'Log Injury'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InjuryTracker;
