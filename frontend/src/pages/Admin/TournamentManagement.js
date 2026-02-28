import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid, Chip, IconButton, Tooltip,
  Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tabs, Tab
} from '@mui/material';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import axios from 'axios';
import { toast } from 'react-toastify';

const FORMATS = ["League", "Knockout", "Mixed (League + Knockout)", "Round Robin", "Double Elimination"];
const MATCH_TYPES = ["T20", "ODI", "Test", "T10", "Mixed"];
const STATUSES = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

const emptyForm = {
  name: '', edition: '', format: 'League', matchType: 'T20',
  startDate: '', endDate: '', venue: '', organizer: '',
  teams: '', status: 'Upcoming', winner: '', runnerUp: '',
  prizePool: 0, currency: 'LKR', description: '', logoUrl: '',
};

const statusColor = { Upcoming: 'primary', Ongoing: 'success', Completed: 'default', Cancelled: 'error' };

const TournamentManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [open, setOpen] = useState(false);
  const [standingsOpen, setStandingsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [standings, setStandings] = useState([]);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTournaments = async () => {
    try {
      const { data } = await axios.get('/api/tournaments');
      setTournaments(data.tournaments);
    } catch { toast.error('Failed to load tournaments'); }
  };

  useEffect(() => { fetchTournaments(); }, []);

  const handleOpen = (row = null) => {
    if (row) {
      setEditId(row._id);
      setForm({
        ...row,
        teams: Array.isArray(row.teams) ? row.teams.join(', ') : row.teams,
        startDate: row.startDate ? row.startDate.substring(0, 10) : '',
        endDate: row.endDate ? row.endDate.substring(0, 10) : '',
      });
    } else { setEditId(null); setForm(emptyForm); }
    setOpen(true);
  };

  const handleStandingsOpen = (row) => {
    setSelectedTournament(row);
    setStandings(row.standings && row.standings.length > 0 ? row.standings :
      (Array.isArray(row.teams) ? row.teams.map(t => ({ teamName: t, played: 0, won: 0, lost: 0, drawn: 0, points: 0, nrr: 0 })) : [])
    );
    setStandingsOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleStandingChange = (idx, field, value) => {
    const updated = standings.map((s, i) => i === idx ? { ...s, [field]: Number(value) } : s);
    setStandings(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...form, teams: form.teams.split(',').map(t => t.trim()).filter(Boolean) };
      if (editId) { await axios.put(`/api/tournaments/${editId}`, payload); toast.success('Tournament updated'); }
      else { await axios.post('/api/tournaments', payload); toast.success('Tournament created'); }
      setOpen(false);
      fetchTournaments();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving tournament'); }
    setLoading(false);
  };

  const handleStandingsSubmit = async () => {
    setLoading(true);
    try {
      await axios.patch(`/api/tournaments/${selectedTournament._id}/standings`, { standings });
      toast.success('Standings updated');
      setStandingsOpen(false);
      fetchTournaments();
    } catch { toast.error('Failed to update standings'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tournament?')) return;
    try {
      await axios.delete(`/api/tournaments/${id}`);
      toast.success('Tournament deleted');
      fetchTournaments();
    } catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { field: 'name', headerName: 'Tournament', width: 200 },
    { field: 'format', headerName: 'Format', width: 170 },
    { field: 'matchType', headerName: 'Type', width: 80 },
    { field: 'startDate', headerName: 'Start', width: 100, renderCell: (p) => p.value ? new Date(p.value).toLocaleDateString() : '-' },
    { field: 'endDate', headerName: 'End', width: 100, renderCell: (p) => p.value ? new Date(p.value).toLocaleDateString() : '-' },
    {
      field: 'teams', headerName: 'Teams', width: 80,
      renderCell: (p) => Array.isArray(p.value) ? p.value.length : 0
    },
    { field: 'winner', headerName: 'Winner', width: 130 },
    {
      field: 'status', headerName: 'Status', width: 100,
      renderCell: (p) => <Chip label={p.value} color={statusColor[p.value] || 'default'} size="small" />
    },
    {
      field: 'actions', headerName: 'Actions', width: 170, sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Standings"><IconButton size="small" color="warning" onClick={() => handleStandingsOpen(p.row)}><LeaderboardIcon fontSize="small" /></IconButton></Tooltip>
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
          <EmojiEventsIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#ffd700' }} />Tournament Management
        </Typography>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => handleOpen()}>Create Tournament</Button>
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
            rows={tournaments}
            columns={columns}
            pageSize={6}
            rowsPerPageOptions={[6]}
            slots={{ toolbar: GridToolbar }}
          />
        </Box>
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>{editId ? 'Edit Tournament' : 'Create Tournament'}</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a', pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={8}><TextField fullWidth label="Tournament Name" name="name" value={form.name} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Edition" name="edition" value={form.edition} onChange={handleChange} placeholder="e.g. 2024" /></Grid>
            <Grid item xs={6}><TextField fullWidth select label="Format" name="format" value={form.format} onChange={handleChange}>{FORMATS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}</TextField></Grid>
            <Grid item xs={6}><TextField fullWidth select label="Match Type" name="matchType" value={form.matchType} onChange={handleChange}>{MATCH_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}</TextField></Grid>
            <Grid item xs={6}><TextField fullWidth label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="End Date" name="endDate" type="date" value={form.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Venue" name="venue" value={form.venue} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Organizer" name="organizer" value={form.organizer} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Teams (comma separated)" name="teams" value={form.teams} onChange={handleChange} placeholder="Team A, Team B, Team C" /></Grid>
            <Grid item xs={4}><TextField fullWidth select label="Status" name="status" value={form.status} onChange={handleChange}>{STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField></Grid>
            <Grid item xs={4}><TextField fullWidth label="Winner" name="winner" value={form.winner} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Runner Up" name="runnerUp" value={form.runnerUp} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Prize Pool" name="prizePool" type="number" value={form.prizePool} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Description" name="description" value={form.description} onChange={handleChange} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e2a3a' }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>{editId ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Standings Dialog */}
      <Dialog open={standingsOpen} onClose={() => setStandingsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>
          <LeaderboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {selectedTournament?.name} — Standings
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a', pt: 2 }}>
          {standings.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
              No teams in this tournament. Add teams first to manage standings.
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { color: '#90caf9', fontWeight: 700, borderColor: '#2a3a4a' } }}>
                    <TableCell>Team</TableCell>
                    <TableCell>P</TableCell>
                    <TableCell>W</TableCell>
                    <TableCell>L</TableCell>
                    <TableCell>D</TableCell>
                    <TableCell>Pts</TableCell>
                    <TableCell>NRR</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {standings.map((row, idx) => (
                    <TableRow key={idx} sx={{ '& td': { borderColor: '#2a3a4a', color: 'white' } }}>
                      <TableCell sx={{ fontWeight: 600 }}>{row.teamName}</TableCell>
                      {['played', 'won', 'lost', 'drawn', 'points'].map(field => (
                        <TableCell key={field}>
                          <TextField size="small" type="number" value={row[field]} onChange={(e) => handleStandingChange(idx, field, e.target.value)} sx={{ width: 60, '& input': { color: 'white', p: '4px 6px' } }} />
                        </TableCell>
                      ))}
                      <TableCell>
                        <TextField size="small" type="number" inputProps={{ step: '0.001' }} value={row.nrr} onChange={(e) => handleStandingChange(idx, 'nrr', e.target.value)} sx={{ width: 70, '& input': { color: 'white', p: '4px 6px' } }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e2a3a' }}>
          <Button onClick={() => setStandingsOpen(false)}>Cancel</Button>
          {standings.length > 0 && <Button variant="contained" color="warning" onClick={handleStandingsSubmit} disabled={loading}>Save Standings</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TournamentManagement;
