import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid, Chip, IconButton, Tooltip,
  Card, CardContent
} from '@mui/material';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from 'axios';
import { toast } from 'react-toastify';

const CONTRACT_TYPES = ["Full-time", "Part-time", "Trial", "Academy", "International"];
const POSITIONS = ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"];
const STATUSES = ["Active", "Expired", "Terminated", "Pending", "Under Review"];
const CURRENCIES = ["LKR", "USD", "GBP", "AUD", "INR"];

const emptyForm = {
  playerName: '', playerEmail: '', playerId: '', contractType: 'Full-time',
  position: 'Batsman', startDate: '', endDate: '', baseSalary: 0,
  signingBonus: 0, performanceBonus: 0, currency: 'LKR',
  status: 'Pending', agentName: '', agentContact: '', notes: '',
};

const statusColor = {
  Active: 'success', Expired: 'error', Terminated: 'error',
  Pending: 'warning', 'Under Review': 'info'
};

const ContractManagement = () => {
  const [contracts, setContracts] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchContracts = async () => {
    try {
      const [contractsRes, expiringRes] = await Promise.all([
        axios.get('/api/contracts'),
        axios.get('/api/contracts/expiring'),
      ]);
      setContracts(contractsRes.data.contracts);
      setExpiring(expiringRes.data.contracts);
    } catch { toast.error('Failed to load contracts'); }
  };

  useEffect(() => { fetchContracts(); }, []);

  const handleOpen = (row = null) => {
    if (row) {
      setEditId(row._id);
      setForm({
        ...row,
        startDate: row.startDate ? row.startDate.substring(0, 10) : '',
        endDate: row.endDate ? row.endDate.substring(0, 10) : '',
      });
    } else { setEditId(null); setForm(emptyForm); }
    setOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) { await axios.put(`/api/contracts/${editId}`, form); toast.success('Contract updated'); }
      else { await axios.post('/api/contracts', form); toast.success('Contract created'); }
      setOpen(false);
      fetchContracts();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving contract'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contract?')) return;
    try {
      await axios.delete(`/api/contracts/${id}`);
      toast.success('Contract deleted');
      fetchContracts();
    } catch { toast.error('Failed to delete'); }
  };

  const totalValue = Number(form.baseSalary) + Number(form.signingBonus) + Number(form.performanceBonus);

  const columns = [
    { field: 'playerName', headerName: 'Player', width: 150 },
    { field: 'contractType', headerName: 'Type', width: 110 },
    { field: 'position', headerName: 'Position', width: 120 },
    { field: 'startDate', headerName: 'Start', width: 100, renderCell: (p) => p.value ? new Date(p.value).toLocaleDateString() : '-' },
    { field: 'endDate', headerName: 'End', width: 100, renderCell: (p) => p.value ? new Date(p.value).toLocaleDateString() : '-' },
    { field: 'baseSalary', headerName: 'Base Salary', width: 110, renderCell: (p) => `${p.row.currency} ${Number(p.value).toLocaleString()}` },
    { field: 'totalValue', headerName: 'Total Value', width: 115, renderCell: (p) => `${p.row.currency} ${Number(p.value).toLocaleString()}` },
    {
      field: 'status', headerName: 'Status', width: 115,
      renderCell: (p) => <Chip label={p.value} color={statusColor[p.value] || 'default'} size="small" />
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
        <Typography variant="h4" sx={{ color: 'white' }}>Contract Management</Typography>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => handleOpen()}>New Contract</Button>
      </Box>

      {expiring.length > 0 && (
        <Card sx={{ bgcolor: '#2d1b00', border: '1px solid #ff9800', mb: 2 }}>
          <CardContent sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningAmberIcon color="warning" />
              <Typography color="warning.main" fontWeight={600}>
                {expiring.length} contract{expiring.length > 1 ? 's' : ''} expiring within 30 days
              </Typography>
            </Box>
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {expiring.map(c => (
                <Chip key={c._id} label={`${c.playerName} — ${new Date(c.endDate).toLocaleDateString()}`} color="warning" size="small" variant="outlined" />
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
            rows={contracts}
            columns={columns}
            pageSize={6}
            rowsPerPageOptions={[6]}
            slots={{ toolbar: GridToolbar }}
          />
        </Box>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>{editId ? 'Edit Contract' : 'New Player Contract'}</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a', pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6}><TextField fullWidth label="Player Name" name="playerName" value={form.playerName} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Player Email" name="playerEmail" value={form.playerEmail} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth select label="Contract Type" name="contractType" value={form.contractType} onChange={handleChange}>{CONTRACT_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}</TextField></Grid>
            <Grid item xs={6}><TextField fullWidth select label="Position" name="position" value={form.position} onChange={handleChange}>{POSITIONS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}</TextField></Grid>
            <Grid item xs={6}><TextField fullWidth label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="End Date" name="endDate" type="date" value={form.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={3}><TextField fullWidth select label="Currency" name="currency" value={form.currency} onChange={handleChange}>{CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}</TextField></Grid>
            <Grid item xs={3}><TextField fullWidth label="Base Salary" name="baseSalary" type="number" value={form.baseSalary} onChange={handleChange} /></Grid>
            <Grid item xs={3}><TextField fullWidth label="Signing Bonus" name="signingBonus" type="number" value={form.signingBonus} onChange={handleChange} /></Grid>
            <Grid item xs={3}><TextField fullWidth label="Perf. Bonus" name="performanceBonus" type="number" value={form.performanceBonus} onChange={handleChange} /></Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 1.5, bgcolor: '#0d2136', borderRadius: 1, border: '1px solid #1565c0' }}>
                <Typography color="primary.light">Total Contract Value: <strong>{form.currency} {totalValue.toLocaleString()}</strong></Typography>
              </Box>
            </Grid>
            <Grid item xs={6}><TextField fullWidth select label="Status" name="status" value={form.status} onChange={handleChange}>{STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField></Grid>
            <Grid item xs={6}><TextField fullWidth label="Agent Name" name="agentName" value={form.agentName} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Notes" name="notes" value={form.notes} onChange={handleChange} /></Grid>
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

export default ContractManagement;
