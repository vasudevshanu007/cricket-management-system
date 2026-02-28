import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, Divider,
  TextField, MenuItem, CircularProgress, Avatar
} from '@mui/material';
import SportsIcon from '@mui/icons-material/Sports';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import axios from 'axios';

const statusColor = { Upcoming: 'primary', Live: 'error', Completed: 'success', Cancelled: 'default' };
const FILTER_STATUSES = ["All", "Upcoming", "Live", "Completed"];
const MATCH_TYPES = ["All", "T20", "ODI", "Test", "T10", "Practice", "Friendly"];

const MatchResults = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data } = await axios.get('/api/matches');
        setMatches(data.matches);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const filtered = matches.filter(m => {
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchType = typeFilter === 'All' || m.matchType === typeFilter;
    return matchStatus && matchType;
  });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 3 }}>
        <SportsIcon sx={{ fontSize: 36, color: '#90caf9' }} />
        <Typography variant="h4" sx={{ color: 'white' }}>Match Results & Fixtures</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField select size="small" label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 130 }}>
          {FILTER_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="Match Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} sx={{ minWidth: 130 }}>
          {MATCH_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
      </Box>

      <Grid container spacing={2}>
        {filtered.length === 0 && (
          <Grid item xs={12}><Typography color="text.secondary" align="center" sx={{ py: 6 }}>No matches found</Typography></Grid>
        )}
        {filtered.map(m => (
          <Grid item xs={12} md={6} key={m._id}>
            <Card sx={{ bgcolor: '#1a2332', border: `1px solid ${m.status === 'Live' ? '#c62828' : '#2a3a4a'}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Chip label={m.matchType} size="small" sx={{ mr: 1, bgcolor: '#1565c0', color: 'white' }} />
                    <Chip label={m.status} color={statusColor[m.status] || 'default'} size="small" />
                  </Box>
                  <Typography variant="caption" color="text.secondary">{new Date(m.date).toLocaleDateString()}</Typography>
                </Box>

                <Typography variant="subtitle1" sx={{ color: '#90caf9', mb: 0.5 }}>{m.matchTitle}</Typography>

                {/* Scorecard */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1.5 }}>
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{m.homeTeam}</Typography>
                    {m.homeTeamInnings && m.status !== 'Upcoming' && (
                      <Typography sx={{ color: '#4fc3f7', fontSize: 20, fontWeight: 800 }}>
                        {m.homeTeamInnings.runs}/{m.homeTeamInnings.wickets}
                        <Typography component="span" sx={{ color: 'text.secondary', fontSize: 12 }}> ({m.homeTeamInnings.overs} ov)</Typography>
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ px: 2 }}>
                    <Typography sx={{ color: '#546e7a', fontWeight: 700 }}>VS</Typography>
                  </Box>
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{m.awayTeam}</Typography>
                    {m.awayTeamInnings && m.status !== 'Upcoming' && (
                      <Typography sx={{ color: '#4fc3f7', fontSize: 20, fontWeight: 800 }}>
                        {m.awayTeamInnings.runs}/{m.awayTeamInnings.wickets}
                        <Typography component="span" sx={{ color: 'text.secondary', fontSize: 12 }}> ({m.awayTeamInnings.overs} ov)</Typography>
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Divider sx={{ borderColor: '#2a3a4a', mb: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">{m.venue}</Typography>
                  {m.tournament && <Typography variant="caption" sx={{ color: '#ce93d8' }}>{m.tournament}</Typography>}
                </Box>

                {m.status === 'Completed' && m.result && m.result !== 'Pending' && (
                  <Box sx={{ mt: 1, p: 1, bgcolor: '#0d2136', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#a5d6a7' }}>
                      <EmojiEventsIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                      {m.result}{m.winningMargin ? ` by ${m.winningMargin}` : ''}
                    </Typography>
                    {m.playerOfMatch && (
                      <Typography variant="caption" color="text.secondary">Player of Match: {m.playerOfMatch}</Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MatchResults;
