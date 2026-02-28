import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid, Chip, IconButton, Tooltip
} from '@mui/material';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import axios from 'axios';
import { toast } from 'react-toastify';

const MATCH_TYPES = ["T20", "ODI", "Test", "T10", "Practice", "Friendly"];
const STATUSES = ["Upcoming", "Live", "Completed", "Cancelled"];
const RESULTS = ["Home Team Won", "Away Team Won", "Draw", "Tie", "No Result", "Abandoned", "Pending"];

const emptyForm = {
  matchTitle: '', matchType: 'T20', date: '', venue: '',
  homeTeam: '', awayTeam: '', status: 'Upcoming', result: 'Pending',
  playerOfMatch: '', winningMargin: '', tournament: '', umpire1: '', umpire2: '', description: '',
  homeTeamInnings: { runs: 0, wickets: 0, overs: 0 },
  awayTeamInnings: { runs: 0, wickets: 0, overs: 0 },
};

const statusColor = { Upcoming: 'primary', Live: 'error', Completed: 'success', Cancelled: 'default' };

const MatchManagement = () => {
  const [matches, setMatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async () => {
    try {
      const { data } = await axios.get('/api/matches');
      setMatches(data.matches);
    } catch { toast.error('Failed to load matches'); }
  };

  useEffect(() => { fetchMatches(); }, []);

  const handleOpen = (row = null) => {
    if (row) {
      setEditId(row._id);
      setForm({
        ...row,
        date: row.date ? row.date.substring(0, 10) : '',
        homeTeamInnings: row.homeTeamInnings || { runs: 0, wickets: 0, overs: 0 },
        awayTeamInnings: row.awayTeamInnings || { runs: 0, wickets: 0, overs: 0 },
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleScoreOpen = (row) => {
    setEditId(row._id);
    setForm({
      homeTeamInnings: row.homeTeamInnings || { runs: 0, wickets: 0, overs: 0 },
      awayTeamInnings: row.awayTeamInnings || { runs: 0, wickets: 0, overs: 0 },
      result: row.result || 'Pending',
      status: row.status,
      playerOfMatch: row.playerOfMatch || '',
      winningMargin: row.winningMargin || '',
    });
    setScoreOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleInningsChange = (team, field, value) => {
    setForm({ ...form, [`${team}Innings`]: { ...form[`${team}Innings`], [field]: Number(value) } });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`/api/matches/${editId}`, form);
        toast.success('Match updated successfully');
      } else {
        await axios.post('/api/matches', form);
        toast.success('Match created successfully');
      }
      setOpen(false);
      fetchMatches();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving match');
    }
    setLoading(false);
  };

  const handleScoreSubmit = async () => {
    setLoading(true);
    try {
      await axios.patch(`/api/matches/${editId}/score`, form);
      toast.success('Score updated successfully');
      setScoreOpen(false);
      fetchMatches();
    } catch { toast.error('Failed to update score'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this match?')) return;
    try {
      await axios.delete(`/api/matches/${id}`);
      toast.success('Match deleted');
      fetchMatches();
    } catch { toast.error('Failed to delete match'); }
  };

  const columns = [
    { field: 'matchTitle', headerName: 'Match', width: 200 },
    { field: 'matchType', headerName: 'Type', width: 80 },
    { field: 'homeTeam', headerName: 'Home', width: 120 },
    { field: 'awayTeam', headerName: 'Away', width: 120 },
    { field: 'venue', headerName: 'Venue', width: 130 },
    {
      field: 'date', headerName: 'Date', width: 110,
      renderCell: (p) => new Date(p.value).toLocaleDateString()
    },
    {
      field: 'status', headerName: 'Status', width: 100,
      renderCell: (p) => <Chip label={p.value} color={statusColor[p.value] || 'default'} size="small" />
    },
    { field: 'result', headerName: 'Result', width: 160 },
    {
      field: 'actions', headerName: 'Actions', width: 180, sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleOpen(p.row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Update Score"><IconButton size="small" color="warning" onClick={() => handleScoreOpen(p.row)}><ScoreboardIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(p.row._id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white' }}>Match Management</Typography>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Match
        </Button>
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
            rows={matches}
            columns={columns}
            pageSize={6}
            rowsPerPageOptions={[6]}
            slots={{ toolbar: GridToolbar }}
          />
        </Box>
      </Paper>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>{editId ? 'Edit Match' : 'Add New Match'}</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a', pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Match Title" name="matchTitle" value={form.matchTitle} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth select label="Match Type" name="matchType" value={form.matchType} onChange={handleChange}>{MATCH_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}</TextField></Grid>
            <Grid item xs={6}><TextField fullWidth label="Date" name="date" type="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Home Team" name="homeTeam" value={form.homeTeam} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Away Team" name="awayTeam" value={form.awayTeam} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Venue" name="venue" value={form.venue} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Tournament" name="tournament" value={form.tournament} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth select label="Status" name="status" value={form.status} onChange={handleChange}>{STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField></Grid>
            <Grid item xs={6}><TextField fullWidth label="Umpire 1" name="umpire1" value={form.umpire1} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Umpire 2" name="umpire2" value={form.umpire2} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Description" name="description" value={form.description} onChange={handleChange} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e2a3a' }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>{editId ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Score Update Dialog */}
      <Dialog open={scoreOpen} onClose={() => setScoreOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>Update Scorecard</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a', pt: 2 }}>
          <Typography variant="subtitle1" sx={{ color: '#90caf9', mb: 1 }}>Home Team Innings</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}><TextField fullWidth label="Runs" type="number" value={form.homeTeamInnings?.runs || 0} onChange={(e) => handleInningsChange('homeTeam', 'runs', e.target.value)} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Wickets" type="number" value={form.homeTeamInnings?.wickets || 0} onChange={(e) => handleInningsChange('homeTeam', 'wickets', e.target.value)} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Overs" type="number" value={form.homeTeamInnings?.overs || 0} onChange={(e) => handleInningsChange('homeTeam', 'overs', e.target.value)} /></Grid>
          </Grid>
          <Typography variant="subtitle1" sx={{ color: '#90caf9', mt: 2, mb: 1 }}>Away Team Innings</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}><TextField fullWidth label="Runs" type="number" value={form.awayTeamInnings?.runs || 0} onChange={(e) => handleInningsChange('awayTeam', 'runs', e.target.value)} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Wickets" type="number" value={form.awayTeamInnings?.wickets || 0} onChange={(e) => handleInningsChange('awayTeam', 'wickets', e.target.value)} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Overs" type="number" value={form.awayTeamInnings?.overs || 0} onChange={(e) => handleInningsChange('awayTeam', 'overs', e.target.value)} /></Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}><TextField fullWidth select label="Result" name="result" value={form.result || 'Pending'} onChange={handleChange}>{RESULTS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}</TextField></Grid>
            <Grid item xs={6}><TextField fullWidth select label="Status" name="status" value={form.status || 'Upcoming'} onChange={handleChange}>{STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField></Grid>
            <Grid item xs={6}><TextField fullWidth label="Winning Margin" name="winningMargin" value={form.winningMargin || ''} onChange={handleChange} placeholder="e.g. 5 wickets" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Player of Match" name="playerOfMatch" value={form.playerOfMatch || ''} onChange={handleChange} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e2a3a' }}>
          <Button onClick={() => setScoreOpen(false)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleScoreSubmit} disabled={loading}>Update Score</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MatchManagement;
