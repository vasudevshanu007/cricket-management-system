import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid, Chip, IconButton, Tooltip,
  Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, LinearProgress, Divider
} from '@mui/material';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { toast } from 'react-toastify';

const SESSION_TYPES = ["Practice", "Match", "Fitness", "Meeting", "Tournament", "Other"];
const ATTENDANCE_STATUSES = ["Present", "Absent", "Late", "Excused"];
const statusColor = { Present: 'success', Absent: 'error', Late: 'warning', Excused: 'info' };

const emptyForm = {
  sessionName: '', sessionType: 'Practice', sessionDate: '',
  venue: '', markedBy: '', notes: '', records: [],
};

const AttendanceManagement = () => {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ totalSessions: 0, avgAttendanceRate: 0 });
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [playerInput, setPlayerInput] = useState({ playerName: '', playerEmail: '', status: 'Present', notes: '' });
  const [viewRecord, setViewRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [allRes, sumRes] = await Promise.all([
        axios.get('/api/attendance'),
        axios.get('/api/attendance/summary'),
      ]);
      setRecords(allRes.data.records);
      setSummary(sumRes.data.summary);
    } catch { toast.error('Failed to load attendance'); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpen = (row = null) => {
    if (row) {
      setEditId(row._id);
      setForm({ ...row, sessionDate: row.sessionDate ? row.sessionDate.substring(0, 10) : '' });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleViewOpen = (row) => { setViewRecord(row); setViewOpen(true); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addPlayer = () => {
    if (!playerInput.playerName) { toast.warning('Enter player name'); return; }
    setForm({ ...form, records: [...form.records, { ...playerInput }] });
    setPlayerInput({ playerName: '', playerEmail: '', status: 'Present', notes: '' });
  };

  const removePlayer = (idx) => setForm({ ...form, records: form.records.filter((_, i) => i !== idx) });

  const updatePlayerStatus = (idx, status) => {
    const updated = form.records.map((r, i) => i === idx ? { ...r, status } : r);
    setForm({ ...form, records: updated });
  };

  const handleSubmit = async () => {
    if (!form.sessionName || !form.sessionDate) { toast.warning('Session name and date are required'); return; }
    setLoading(true);
    try {
      if (editId) { await axios.put(`/api/attendance/${editId}`, form); toast.success('Attendance updated'); }
      else { await axios.post('/api/attendance', form); toast.success('Attendance marked'); }
      setOpen(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return;
    try {
      await axios.delete(`/api/attendance/${id}`);
      toast.success('Record deleted');
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { field: 'sessionName', headerName: 'Session', width: 200 },
    { field: 'sessionType', headerName: 'Type', width: 110, renderCell: (p) => <Chip label={p.value} size="small" variant="outlined" sx={{ color: 'white', borderColor: '#4a6080' }} /> },
    { field: 'sessionDate', headerName: 'Date', width: 110, renderCell: (p) => p.value ? new Date(p.value).toLocaleDateString() : '-' },
    { field: 'venue', headerName: 'Venue', width: 130 },
    { field: 'totalCount', headerName: 'Total', width: 70 },
    { field: 'presentCount', headerName: 'Present', width: 80, renderCell: (p) => <Typography sx={{ color: '#a5d6a7', fontWeight: 600 }}>{p.value}</Typography> },
    { field: 'absentCount', headerName: 'Absent', width: 80, renderCell: (p) => <Typography sx={{ color: '#ef9a9a', fontWeight: 600 }}>{p.value}</Typography> },
    {
      field: 'rate', headerName: 'Rate', width: 120,
      renderCell: (p) => {
        const rate = p.row.totalCount > 0 ? Math.round((p.row.presentCount / p.row.totalCount) * 100) : 0;
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="caption" sx={{ color: rate >= 75 ? '#a5d6a7' : '#ef9a9a' }}>{rate}%</Typography>
            <LinearProgress variant="determinate" value={rate} color={rate >= 75 ? 'success' : 'error'} sx={{ height: 4, borderRadius: 2 }} />
          </Box>
        );
      }
    },
    { field: 'markedBy', headerName: 'Marked By', width: 120 },
    {
      field: 'actions', headerName: 'Actions', width: 140, sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View Details"><IconButton size="small" color="info" onClick={() => handleViewOpen(p.row)}><GroupIcon fontSize="small" /></IconButton></Tooltip>
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
          <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Attendance Management
        </Typography>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => handleOpen()}>Mark Attendance</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { label: 'Total Sessions', value: summary.totalSessions, color: '#1565c0' },
          { label: 'Avg Attendance Rate', value: `${summary.avgAttendanceRate}%`, color: summary.avgAttendanceRate >= 75 ? '#2e7d32' : '#c62828' },
        ].map(({ label, value, color }) => (
          <Grid item xs={6} md={3} key={label}>
            <Card sx={{ bgcolor: color }}>
              <CardContent sx={{ py: 1.5 }}>
                <Typography variant="h4" fontWeight={700} color="white">{value}</Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.8)">{label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ bgcolor: 'secondary.midNightBlue' }}>
        <Box sx={{ height: 430, width: '100%' }}>
          <DataGrid
            sx={{
              color: 'black',
              '& .MuiTablePagination-displayedRows': { color: 'white' },
              [`& .${gridClasses.row}`]: { bgcolor: (t) => t.palette.secondary.main },
              button: { color: '#ffffff' },
            }}
            getRowId={(row) => row._id}
            rows={records}
            columns={columns}
            pageSize={6}
            rowsPerPageOptions={[6]}
            slots={{ toolbar: GridToolbar }}
          />
        </Box>
      </Paper>

      {/* Mark / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>{editId ? 'Edit Attendance' : 'Mark Attendance'}</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a', pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6}><TextField fullWidth label="Session Name" name="sessionName" value={form.sessionName} onChange={handleChange} /></Grid>
            <Grid item xs={3}>
              <TextField fullWidth select label="Type" name="sessionType" value={form.sessionType} onChange={handleChange}>
                {SESSION_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={3}><TextField fullWidth label="Date" name="sessionDate" type="date" value={form.sessionDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Venue" name="venue" value={form.venue} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Marked By" name="markedBy" value={form.markedBy} onChange={handleChange} /></Grid>
          </Grid>

          <Divider sx={{ my: 2, borderColor: '#2a3a4a' }} />
          <Typography variant="subtitle2" sx={{ color: '#90caf9', mb: 1 }}>Add Players</Typography>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={4}><TextField fullWidth size="small" label="Player Name" value={playerInput.playerName} onChange={(e) => setPlayerInput({ ...playerInput, playerName: e.target.value })} /></Grid>
            <Grid item xs={3}><TextField fullWidth size="small" label="Email (optional)" value={playerInput.playerEmail} onChange={(e) => setPlayerInput({ ...playerInput, playerEmail: e.target.value })} /></Grid>
            <Grid item xs={3}>
              <TextField fullWidth size="small" select label="Status" value={playerInput.status} onChange={(e) => setPlayerInput({ ...playerInput, status: e.target.value })}>
                {ATTENDANCE_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={2}><Button fullWidth variant="outlined" onClick={addPlayer}>Add</Button></Grid>
          </Grid>

          {form.records.length > 0 && (
            <TableContainer sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { color: '#90caf9', borderColor: '#2a3a4a' } }}>
                    <TableCell>Player</TableCell><TableCell>Status</TableCell><TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {form.records.map((r, idx) => (
                    <TableRow key={idx} sx={{ '& td': { borderColor: '#2a3a4a', color: 'white' } }}>
                      <TableCell>{r.playerName}</TableCell>
                      <TableCell>
                        <TextField size="small" select value={r.status} onChange={(e) => updatePlayerStatus(idx, e.target.value)} sx={{ minWidth: 110 }}>
                          {ATTENDANCE_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" color="error" onClick={() => removePlayer(idx)}><DeleteIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e2a3a' }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>{editId ? 'Update' : 'Save Attendance'}</Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>
          {viewRecord?.sessionName} — {viewRecord?.sessionDate ? new Date(viewRecord.sessionDate).toLocaleDateString() : ''}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a' }}>
          {viewRecord && (
            <>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip label={`Present: ${viewRecord.presentCount}`} color="success" size="small" />
                <Chip label={`Absent: ${viewRecord.absentCount}`} color="error" size="small" />
                <Chip label={`Late: ${viewRecord.lateCount}`} color="warning" size="small" />
                <Chip label={`Excused: ${viewRecord.excusedCount}`} color="info" size="small" />
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { color: '#90caf9', borderColor: '#2a3a4a' } }}>
                      <TableCell>Player</TableCell><TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {viewRecord.records?.map((r, i) => (
                      <TableRow key={i} sx={{ '& td': { borderColor: '#2a3a4a', color: 'white' } }}>
                        <TableCell>{r.playerName}</TableCell>
                        <TableCell><Chip label={r.status} color={statusColor[r.status] || 'default'} size="small" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e2a3a' }}>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendanceManagement;
