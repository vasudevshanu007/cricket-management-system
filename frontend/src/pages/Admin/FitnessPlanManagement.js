import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid, Chip, IconButton, Tooltip,
  Card, CardContent, Divider, LinearProgress, Accordion, AccordionSummary,
  AccordionDetails, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { toast } from 'react-toastify';

const PLAN_TYPES = ["Fitness", "Nutrition", "Rehabilitation", "Pre-Season", "In-Season", "Off-Season", "Combined"];
const FITNESS_LEVELS = ["Poor", "Below Average", "Average", "Good", "Excellent"];
const STATUSES = ["Active", "Completed", "On Hold", "Cancelled"];

const emptyExercise = { name: '', sets: '', reps: '', duration: '', frequency: 'Daily', notes: '' };
const emptyForm = {
  playerName: '', playerEmail: '', planType: 'Fitness', createdBy: '',
  startDate: '', endDate: '', status: 'Active', fitnessGoal: '',
  currentFitnessLevel: 'Average', targetFitnessLevel: 'Good',
  weight: '', targetWeight: '', bmi: '',
  exercises: [],
  dailyCalories: '', proteinGrams: '', carbsGrams: '', fatsGrams: '',
  specialDiet: '', dietaryRestrictions: '', hydrationLiters: '',
  progressNotes: '', nextReviewDate: '', completionPercentage: 0,
};

const statusColor = { Active: 'success', Completed: 'info', 'On Hold': 'warning', Cancelled: 'error' };
const levelColor = { Poor: '#c62828', 'Below Average': '#e65100', Average: '#f9a825', Good: '#2e7d32', Excellent: '#1565c0' };

const FitnessPlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [viewPlan, setViewPlan] = useState(null);
  const [newExercise, setNewExercise] = useState(emptyExercise);
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get('/api/fitness');
      setPlans(data.plans);
    } catch { toast.error('Failed to load fitness plans'); }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleOpen = (row = null) => {
    if (row) {
      setEditId(row._id);
      setForm({
        ...row,
        startDate: row.startDate ? row.startDate.substring(0, 10) : '',
        endDate: row.endDate ? row.endDate.substring(0, 10) : '',
        nextReviewDate: row.nextReviewDate ? row.nextReviewDate.substring(0, 10) : '',
      });
    } else { setEditId(null); setForm(emptyForm); }
    setOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addExercise = () => {
    if (!newExercise.name) { toast.warning('Exercise name required'); return; }
    setForm({ ...form, exercises: [...form.exercises, { ...newExercise }] });
    setNewExercise(emptyExercise);
  };

  const removeExercise = (idx) => setForm({ ...form, exercises: form.exercises.filter((_, i) => i !== idx) });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) { await axios.put(`/api/fitness/${editId}`, form); toast.success('Plan updated'); }
      else { await axios.post('/api/fitness', form); toast.success('Fitness plan created'); }
      setOpen(false);
      fetchPlans();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving plan'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this fitness plan?')) return;
    try {
      await axios.delete(`/api/fitness/${id}`);
      toast.success('Plan deleted');
      fetchPlans();
    } catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { field: 'playerName', headerName: 'Player', width: 140 },
    { field: 'planType', headerName: 'Plan Type', width: 130 },
    { field: 'startDate', headerName: 'Start', width: 100, renderCell: (p) => p.value ? new Date(p.value).toLocaleDateString() : '-' },
    { field: 'endDate', headerName: 'End', width: 100, renderCell: (p) => p.value ? new Date(p.value).toLocaleDateString() : '-' },
    {
      field: 'currentFitnessLevel', headerName: 'Current', width: 110,
      renderCell: (p) => <Chip label={p.value} size="small" sx={{ bgcolor: levelColor[p.value] || '#37474f', color: 'white', fontSize: 11 }} />
    },
    {
      field: 'targetFitnessLevel', headerName: 'Target', width: 110,
      renderCell: (p) => <Chip label={p.value} size="small" sx={{ bgcolor: levelColor[p.value] || '#37474f', color: 'white', fontSize: 11 }} />
    },
    {
      field: 'completionPercentage', headerName: 'Progress', width: 130,
      renderCell: (p) => (
        <Box sx={{ width: '100%' }}>
          <Typography variant="caption" sx={{ color: 'white' }}>{p.value}%</Typography>
          <LinearProgress variant="determinate" value={p.value} color="primary" sx={{ height: 4, borderRadius: 2 }} />
        </Box>
      )
    },
    {
      field: 'status', headerName: 'Status', width: 100,
      renderCell: (p) => <Chip label={p.value} color={statusColor[p.value] || 'default'} size="small" />
    },
    { field: 'createdBy', headerName: 'Created By', width: 120 },
    {
      field: 'actions', headerName: 'Actions', width: 140, sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View Plan"><IconButton size="small" color="info" onClick={() => { setViewPlan(p.row); setViewOpen(true); }}><FitnessCenterIcon fontSize="small" /></IconButton></Tooltip>
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
          <FitnessCenterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Fitness & Nutrition Plans
        </Typography>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => handleOpen()}>Create Plan</Button>
      </Box>

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
            rows={plans}
            columns={columns}
            pageSize={6}
            rowsPerPageOptions={[6]}
            slots={{ toolbar: GridToolbar }}
          />
        </Box>
      </Paper>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>{editId ? 'Edit Plan' : 'Create Fitness Plan'}</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a', pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6}><TextField fullWidth label="Player Name" name="playerName" value={form.playerName} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Player Email" name="playerEmail" value={form.playerEmail} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth select label="Plan Type" name="planType" value={form.planType} onChange={handleChange}>{PLAN_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}</TextField></Grid>
            <Grid item xs={4}><TextField fullWidth select label="Status" name="status" value={form.status} onChange={handleChange}>{STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField></Grid>
            <Grid item xs={4}><TextField fullWidth label="Created By" name="createdBy" value={form.createdBy} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="End Date" name="endDate" type="date" value={form.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Next Review" name="nextReviewDate" type="date" value={form.nextReviewDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={6}><TextField fullWidth select label="Current Fitness" name="currentFitnessLevel" value={form.currentFitnessLevel} onChange={handleChange}>{FITNESS_LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}</TextField></Grid>
            <Grid item xs={6}><TextField fullWidth select label="Target Fitness" name="targetFitnessLevel" value={form.targetFitnessLevel} onChange={handleChange}>{FITNESS_LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}</TextField></Grid>
            <Grid item xs={4}><TextField fullWidth label="Weight (kg)" name="weight" type="number" value={form.weight} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Target Weight (kg)" name="targetWeight" type="number" value={form.targetWeight} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Completion %" name="completionPercentage" type="number" inputProps={{ min: 0, max: 100 }} value={form.completionPercentage} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Fitness Goal" name="fitnessGoal" value={form.fitnessGoal} onChange={handleChange} /></Grid>
          </Grid>

          <Divider sx={{ my: 2, borderColor: '#2a3a4a' }} />
          <Typography variant="subtitle2" sx={{ color: '#90caf9', mb: 1 }}>Nutrition Plan</Typography>
          <Grid container spacing={2}>
            <Grid item xs={3}><TextField fullWidth label="Daily Calories" name="dailyCalories" type="number" value={form.dailyCalories} onChange={handleChange} /></Grid>
            <Grid item xs={3}><TextField fullWidth label="Protein (g)" name="proteinGrams" type="number" value={form.proteinGrams} onChange={handleChange} /></Grid>
            <Grid item xs={3}><TextField fullWidth label="Carbs (g)" name="carbsGrams" type="number" value={form.carbsGrams} onChange={handleChange} /></Grid>
            <Grid item xs={3}><TextField fullWidth label="Fats (g)" name="fatsGrams" type="number" value={form.fatsGrams} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Special Diet" name="specialDiet" value={form.specialDiet} onChange={handleChange} placeholder="e.g. Vegetarian, Keto" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Dietary Restrictions" name="dietaryRestrictions" value={form.dietaryRestrictions} onChange={handleChange} /></Grid>
          </Grid>

          <Divider sx={{ my: 2, borderColor: '#2a3a4a' }} />
          <Typography variant="subtitle2" sx={{ color: '#90caf9', mb: 1 }}>Exercise Plan</Typography>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={3}><TextField fullWidth size="small" label="Exercise Name" value={newExercise.name} onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })} /></Grid>
            <Grid item xs={1}><TextField fullWidth size="small" label="Sets" type="number" value={newExercise.sets} onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })} /></Grid>
            <Grid item xs={1}><TextField fullWidth size="small" label="Reps" type="number" value={newExercise.reps} onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })} /></Grid>
            <Grid item xs={2}><TextField fullWidth size="small" label="Duration" value={newExercise.duration} onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })} placeholder="30 min" /></Grid>
            <Grid item xs={2}><TextField fullWidth size="small" label="Frequency" value={newExercise.frequency} onChange={(e) => setNewExercise({ ...newExercise, frequency: e.target.value })} /></Grid>
            <Grid item xs={2}><Button fullWidth variant="outlined" size="small" onClick={addExercise}>+ Add</Button></Grid>
          </Grid>
          {form.exercises.length > 0 && (
            <Table size="small" sx={{ mt: 1 }}>
              <TableHead>
                <TableRow sx={{ '& th': { color: '#90caf9', borderColor: '#2a3a4a' } }}>
                  <TableCell>Exercise</TableCell><TableCell>Sets</TableCell><TableCell>Reps</TableCell><TableCell>Duration</TableCell><TableCell>Freq.</TableCell><TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {form.exercises.map((ex, i) => (
                  <TableRow key={i} sx={{ '& td': { borderColor: '#2a3a4a', color: 'white' } }}>
                    <TableCell>{ex.name}</TableCell>
                    <TableCell>{ex.sets}</TableCell>
                    <TableCell>{ex.reps}</TableCell>
                    <TableCell>{ex.duration}</TableCell>
                    <TableCell>{ex.frequency}</TableCell>
                    <TableCell><IconButton size="small" color="error" onClick={() => removeExercise(i)}><DeleteIcon fontSize="small" /></IconButton></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Divider sx={{ my: 2, borderColor: '#2a3a4a' }} />
          <TextField fullWidth multiline rows={3} label="Progress Notes" name="progressNotes" value={form.progressNotes} onChange={handleChange} />
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e2a3a' }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>{editId ? 'Update' : 'Create Plan'}</Button>
        </DialogActions>
      </Dialog>

      {/* View Plan Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>
          <FitnessCenterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {viewPlan?.playerName} — {viewPlan?.planType} Plan
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a' }}>
          {viewPlan && (
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={viewPlan.status} color={statusColor[viewPlan.status] || 'default'} />
                <Chip label={`Progress: ${viewPlan.completionPercentage}%`} color="primary" />
              </Box>
              <LinearProgress variant="determinate" value={viewPlan.completionPercentage} sx={{ mb: 2, height: 8, borderRadius: 4 }} />
              <Typography color="text.secondary" gutterBottom>Goal: {viewPlan.fitnessGoal}</Typography>
              {viewPlan.dailyCalories && (
                <Box sx={{ p: 1.5, bgcolor: '#0d2136', borderRadius: 1, mb: 1.5 }}>
                  <Typography sx={{ color: '#90caf9', fontWeight: 600, mb: 0.5 }}>Nutrition</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {viewPlan.dailyCalories} kcal | Protein: {viewPlan.proteinGrams}g | Carbs: {viewPlan.carbsGrams}g | Fats: {viewPlan.fatsGrams}g
                  </Typography>
                  {viewPlan.specialDiet && <Typography variant="body2" color="text.secondary">Diet: {viewPlan.specialDiet}</Typography>}
                </Box>
              )}
              {viewPlan.exercises && viewPlan.exercises.length > 0 && (
                <Box>
                  <Typography sx={{ color: '#90caf9', fontWeight: 600, mb: 0.5 }}>Exercises ({viewPlan.exercises.length})</Typography>
                  {viewPlan.exercises.map((ex, i) => (
                    <Box key={i} sx={{ p: 1, bgcolor: '#0d1b2a', borderRadius: 1, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{ex.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ex.sets && `${ex.sets} sets`}{ex.reps && ` × ${ex.reps} reps`}{ex.duration && ` | ${ex.duration}`}{ex.frequency && ` | ${ex.frequency}`}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
              {viewPlan.progressNotes && (
                <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#1a3a00', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: '#a5d6a7' }}>Progress Notes:</Typography>
                  <Typography variant="body2" color="text.secondary">{viewPlan.progressNotes}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e2a3a' }}>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FitnessPlanManagement;
