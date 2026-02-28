import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, MenuItem, TextField
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import axios from 'axios';

const statusColor = { Upcoming: 'primary', Ongoing: 'success', Completed: 'default', Cancelled: 'error' };

const TournamentStandings = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const { data } = await axios.get('/api/tournaments');
        setTournaments(data.tournaments);
        if (data.tournaments.length > 0) setSelected(data.tournaments[0]._id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  const currentTournament = tournaments.find(t => t._id === selected);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 3 }}>
        <EmojiEventsIcon sx={{ fontSize: 36, color: '#ffd700' }} />
        <Typography variant="h4" sx={{ color: 'white' }}>Tournaments & Standings</Typography>
      </Box>

      {tournaments.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 8 }}>No tournaments found</Typography>
      ) : (
        <>
          <TextField
            select size="small" label="Select Tournament" value={selected}
            onChange={(e) => setSelected(e.target.value)} sx={{ minWidth: 300, mb: 3 }}
          >
            {tournaments.map(t => <MenuItem key={t._id} value={t._id}>{t.name} {t.edition && `(${t.edition})`}</MenuItem>)}
          </TextField>

          {currentTournament && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: '#1a2332', border: '1px solid #2a3a4a', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip label={currentTournament.status} color={statusColor[currentTournament.status] || 'default'} />
                      <Chip label={currentTournament.matchType} sx={{ bgcolor: '#1565c0', color: 'white' }} />
                    </Box>
                    <Typography variant="h5" sx={{ color: 'white', mb: 1 }}>{currentTournament.name}</Typography>
                    {currentTournament.edition && <Typography color="text.secondary" gutterBottom>Edition: {currentTournament.edition}</Typography>}
                    <Typography variant="body2" color="text.secondary" gutterBottom>Format: {currentTournament.format}</Typography>
                    {currentTournament.venue && <Typography variant="body2" color="text.secondary" gutterBottom>Venue: {currentTournament.venue}</Typography>}
                    {currentTournament.organizer && <Typography variant="body2" color="text.secondary" gutterBottom>Organizer: {currentTournament.organizer}</Typography>}
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {new Date(currentTournament.startDate).toLocaleDateString()} — {new Date(currentTournament.endDate).toLocaleDateString()}
                    </Typography>
                    {currentTournament.teams && currentTournament.teams.length > 0 && (
                      <Box sx={{ mt: 1.5 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Participating Teams:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {currentTournament.teams.map((team, i) => (
                            <Chip key={i} label={team} size="small" variant="outlined" sx={{ color: 'white', borderColor: '#4a6080' }} />
                          ))}
                        </Box>
                      </Box>
                    )}
                    {currentTournament.winner && (
                      <Box sx={{ mt: 2, p: 1.5, bgcolor: '#1a3a00', borderRadius: 1 }}>
                        <Typography color="success.light">
                          <EmojiEventsIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                          Winner: <strong>{currentTournament.winner}</strong>
                        </Typography>
                        {currentTournament.runnerUp && <Typography variant="body2" color="text.secondary">Runner-up: {currentTournament.runnerUp}</Typography>}
                      </Box>
                    )}
                    {currentTournament.prizePool > 0 && (
                      <Typography variant="body2" sx={{ color: '#ffd700', mt: 1 }}>
                        Prize Pool: {currentTournament.currency} {Number(currentTournament.prizePool).toLocaleString()}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="h6" sx={{ color: '#90caf9', mb: 1.5 }}>Points Table</Typography>
                {currentTournament.standings && currentTournament.standings.length > 0 ? (
                  <TableContainer component={Paper} sx={{ bgcolor: '#1a2332' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#0d1b2a' }}>
                          {['#', 'Team', 'P', 'W', 'L', 'D', 'Pts', 'NRR'].map(h => (
                            <TableCell key={h} sx={{ color: '#90caf9', fontWeight: 700, borderColor: '#2a3a4a' }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[...currentTournament.standings]
                          .sort((a, b) => b.points - a.points || b.nrr - a.nrr)
                          .map((row, idx) => (
                            <TableRow key={idx} sx={{
                              bgcolor: idx === 0 ? '#1a3a00' : 'transparent',
                              '& td': { borderColor: '#2a3a4a', color: 'white' }
                            }}>
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell sx={{ fontWeight: idx === 0 ? 700 : 400 }}>
                                {idx === 0 && <EmojiEventsIcon sx={{ fontSize: 14, mr: 0.5, color: '#ffd700', verticalAlign: 'middle' }} />}
                                {row.teamName}
                              </TableCell>
                              <TableCell>{row.played}</TableCell>
                              <TableCell sx={{ color: '#a5d6a7' }}>{row.won}</TableCell>
                              <TableCell sx={{ color: '#ef9a9a' }}>{row.lost}</TableCell>
                              <TableCell>{row.drawn}</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>{row.points}</TableCell>
                              <TableCell sx={{ color: row.nrr >= 0 ? '#a5d6a7' : '#ef9a9a' }}>
                                {row.nrr >= 0 ? '+' : ''}{Number(row.nrr).toFixed(3)}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="text.secondary" sx={{ py: 3 }}>Standings not available yet</Typography>
                )}
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default TournamentStandings;
