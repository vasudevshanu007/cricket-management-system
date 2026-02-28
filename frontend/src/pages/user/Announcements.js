import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, Divider,
  TextField, MenuItem, InputAdornment, CircularProgress
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import PushPinIcon from '@mui/icons-material/PushPin';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const priorityColor = { Low: 'default', Medium: 'info', High: 'warning', Urgent: 'error' };
const categoryColor = {
  General: '#1565c0', Match: '#2e7d32', Training: '#6a1b9a',
  Medical: '#c62828', Financial: '#e65100', Selection: '#00695c',
  Recruitment: '#4527a0', Other: '#37474f'
};
const CATEGORIES = ["All", "General", "Match", "Training", "Medical", "Financial", "Selection", "Recruitment", "Other"];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await axios.get('/api/announcements/active');
        setAnnouncements(data.announcements);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const filtered = announcements.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'All' || a.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const pinned = filtered.filter(a => a.isPinned);
  const regular = filtered.filter(a => !a.isPinned);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 3 }}>
        <CampaignIcon sx={{ fontSize: 36, color: '#90caf9' }} />
        <Typography variant="h4" sx={{ color: 'white' }}>Announcements</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search announcements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ flexGrow: 1 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'grey' }} /></InputAdornment> }}
        />
        <TextField
          select size="small" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
      </Box>

      {pinned.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ color: '#ffa726', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PushPinIcon fontSize="small" /> Pinned
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {pinned.map(a => <AnnouncementCard key={a._id} a={a} />)}
          </Grid>
        </>
      )}

      {regular.length > 0 && (
        <>
          {pinned.length > 0 && <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 1.5 }}>Latest</Typography>}
          <Grid container spacing={2}>
            {regular.map(a => <AnnouncementCard key={a._id} a={a} />)}
          </Grid>
        </>
      )}

      {filtered.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CampaignIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary">No announcements found</Typography>
        </Box>
      )}
    </Box>
  );
};

const AnnouncementCard = ({ a }) => (
  <Grid item xs={12} md={6}>
    <Card sx={{ bgcolor: '#1a2332', border: `1px solid ${a.isPinned ? '#ffa726' : '#2a3a4a'}`, height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={a.category} size="small" sx={{ bgcolor: categoryColor[a.category] || '#37474f', color: 'white' }} />
          <Chip label={a.priority} color={priorityColor[a.priority] || 'default'} size="small" />
          {a.isPinned && <Chip label="Pinned" size="small" sx={{ bgcolor: '#b45309', color: 'white' }} icon={<PushPinIcon style={{ fontSize: 12, color: 'white' }} />} />}
        </Box>
        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>{a.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{a.content}</Typography>
        <Divider sx={{ borderColor: '#2a3a4a', mb: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            {a.authorName ? `By ${a.authorName}` : 'Management'} • {new Date(a.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">For: {a.targetAudience}</Typography>
        </Box>
      </CardContent>
    </Card>
  </Grid>
);

export default Announcements;
