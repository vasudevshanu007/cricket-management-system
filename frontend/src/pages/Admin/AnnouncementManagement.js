import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid, Chip, IconButton, Tooltip,
  Card, CardContent, CardActions, Divider, Switch, FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PushPinIcon from '@mui/icons-material/PushPin';
import CampaignIcon from '@mui/icons-material/Campaign';
import axios from 'axios';
import { toast } from 'react-toastify';

const CATEGORIES = ["General", "Match", "Training", "Medical", "Financial", "Selection", "Recruitment", "Other"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];
const AUDIENCES = ["All", "Players", "Coaches", "Staff", "Admin"];

const emptyForm = {
  title: '', content: '', category: 'General', priority: 'Medium',
  targetAudience: 'All', authorName: '', isActive: true, isPinned: false,
  expiresAt: '', attachmentUrl: '',
};

const priorityColor = { Low: 'default', Medium: 'info', High: 'warning', Urgent: 'error' };
const categoryColor = {
  General: '#1565c0', Match: '#2e7d32', Training: '#6a1b9a',
  Medical: '#c62828', Financial: '#e65100', Selection: '#00695c',
  Recruitment: '#4527a0', Other: '#37474f'
};

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await axios.get('/api/announcements');
      setAnnouncements(data.announcements);
    } catch { toast.error('Failed to load announcements'); }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleOpen = (row = null) => {
    if (row) {
      setEditId(row._id);
      setForm({ ...row, expiresAt: row.expiresAt ? row.expiresAt.substring(0, 10) : '' });
    } else { setEditId(null); setForm(emptyForm); }
    setOpen(true);
  };

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) { await axios.put(`/api/announcements/${editId}`, form); toast.success('Announcement updated'); }
      else { await axios.post('/api/announcements', form); toast.success('Announcement posted'); }
      setOpen(false);
      fetchAnnouncements();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving announcement'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await axios.delete(`/api/announcements/${id}`);
      toast.success('Announcement deleted');
      fetchAnnouncements();
    } catch { toast.error('Failed to delete'); }
  };

  const handlePin = async (id) => {
    try {
      await axios.patch(`/api/announcements/${id}/pin`);
      fetchAnnouncements();
    } catch { toast.error('Failed to toggle pin'); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          <CampaignIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Announcements
        </Typography>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => handleOpen()}>Post Announcement</Button>
      </Box>

      <Grid container spacing={2}>
        {announcements.length === 0 && (
          <Grid item xs={12}><Typography color="text.secondary" align="center" sx={{ py: 4 }}>No announcements yet.</Typography></Grid>
        )}
        {announcements.map((a) => (
          <Grid item xs={12} md={6} key={a._id}>
            <Card sx={{ bgcolor: '#1a2332', border: `1px solid ${a.isPinned ? '#ffa726' : '#2a3a4a'}`, position: 'relative' }}>
              {a.isPinned && (
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <PushPinIcon sx={{ color: '#ffa726', fontSize: 18 }} />
                </Box>
              )}
              <CardContent>
                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  <Chip label={a.category} size="small" sx={{ bgcolor: categoryColor[a.category] || '#37474f', color: 'white' }} />
                  <Chip label={a.priority} color={priorityColor[a.priority] || 'default'} size="small" />
                  <Chip label={a.targetAudience} variant="outlined" size="small" sx={{ color: 'white', borderColor: '#4a6080' }} />
                  {!a.isActive && <Chip label="Inactive" color="default" size="small" />}
                </Box>
                <Typography variant="h6" sx={{ color: 'white', mb: 0.5, pr: 3 }}>{a.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {a.content}
                </Typography>
                <Divider sx={{ borderColor: '#2a3a4a', mb: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {a.authorName && `By ${a.authorName} • `}{new Date(a.createdAt).toLocaleDateString()} • {a.views} views
                  </Typography>
                  {a.expiresAt && (
                    <Typography variant="caption" color="warning.main">Expires: {new Date(a.expiresAt).toLocaleDateString()}</Typography>
                  )}
                </Box>
              </CardContent>
              <CardActions sx={{ pt: 0 }}>
                <Tooltip title={a.isPinned ? 'Unpin' : 'Pin'}><IconButton size="small" onClick={() => handlePin(a._id)} sx={{ color: a.isPinned ? '#ffa726' : 'grey' }}><PushPinIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleOpen(a)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(a._id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>{editId ? 'Edit Announcement' : 'Post New Announcement'}</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a', pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Title" name="title" value={form.title} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth select label="Category" name="category" value={form.category} onChange={handleChange}>{CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}</TextField></Grid>
            <Grid item xs={4}><TextField fullWidth select label="Priority" name="priority" value={form.priority} onChange={handleChange}>{PRIORITIES.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}</TextField></Grid>
            <Grid item xs={4}><TextField fullWidth select label="Audience" name="targetAudience" value={form.targetAudience} onChange={handleChange}>{AUDIENCES.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={4} label="Content" name="content" value={form.content} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Author Name" name="authorName" value={form.authorName} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Expires At" name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange} InputLabelProps={{ shrink: true }} helperText="Leave empty for no expiry" /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Attachment URL (optional)" name="attachmentUrl" value={form.attachmentUrl} onChange={handleChange} /></Grid>
            <Grid item xs={6}><FormControlLabel control={<Switch checked={form.isActive} name="isActive" onChange={handleChange} />} label="Active" /></Grid>
            <Grid item xs={6}><FormControlLabel control={<Switch checked={form.isPinned} name="isPinned" onChange={handleChange} />} label="Pinned" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e2a3a' }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>{editId ? 'Update' : 'Post'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnnouncementManagement;
