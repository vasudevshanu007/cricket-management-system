import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, CircularProgress,
  LinearProgress, Divider, TextField, Paper, Table, TableBody,
  TableCell, TableHead, TableRow
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'axios';
import { useSelector } from 'react-redux';

const statusColor = { Active: 'success', Completed: 'info', 'On Hold': 'warning', Cancelled: 'error' };
const levelColor = { Poor: '#c62828', 'Below Average': '#e65100', Average: '#f9a825', Good: '#2e7d32', Excellent: '#1565c0' };

const MyFitnessPlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector(state => state.signIn);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const email = userInfo?.email;
        const url = email ? `/api/fitness?playerEmail=${encodeURIComponent(email)}` : '/api/fitness/active';
        const { data } = await axios.get(url);
        setPlans(data.plans);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [userInfo]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 3 }}>
        <FitnessCenterIcon sx={{ fontSize: 36, color: '#90caf9' }} />
        <Typography variant="h4" sx={{ color: 'white' }}>My Fitness & Nutrition Plans</Typography>
      </Box>

      {plans.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FitnessCenterIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary">No fitness plans assigned yet.</Typography>
          <Typography variant="body2" color="text.secondary">Contact your coach or fitness trainer.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {plans.map(plan => (
            <Grid item xs={12} key={plan._id}>
              <Card sx={{ bgcolor: '#1a2332', border: '1px solid #2a3a4a' }}>
                <CardContent>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography variant="h5" sx={{ color: 'white', mb: 0.5 }}>{plan.planType} Plan</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.startDate ? new Date(plan.startDate).toLocaleDateString() : ''} — {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : ''}
                        {plan.createdBy && ` • By ${plan.createdBy}`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label={plan.status} color={statusColor[plan.status] || 'default'} />
                      {plan.nextReviewDate && (
                        <Chip label={`Review: ${new Date(plan.nextReviewDate).toLocaleDateString()}`} variant="outlined" sx={{ color: '#ffa726', borderColor: '#ffa726' }} size="small" />
                      )}
                    </Box>
                  </Box>

                  {/* Progress */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Progress</Typography>
                      <Typography variant="body2" sx={{ color: '#90caf9', fontWeight: 600 }}>{plan.completionPercentage}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={plan.completionPercentage} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>

                  {/* Fitness Levels */}
                  {(plan.currentFitnessLevel || plan.targetFitnessLevel) && (
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {plan.currentFitnessLevel && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Current Level</Typography>
                          <Chip label={plan.currentFitnessLevel} size="small" sx={{ display: 'block', mt: 0.3, bgcolor: levelColor[plan.currentFitnessLevel], color: 'white' }} />
                        </Box>
                      )}
                      {plan.targetFitnessLevel && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Target Level</Typography>
                          <Chip label={plan.targetFitnessLevel} size="small" sx={{ display: 'block', mt: 0.3, bgcolor: levelColor[plan.targetFitnessLevel], color: 'white' }} />
                        </Box>
                      )}
                    </Box>
                  )}

                  {plan.fitnessGoal && (
                    <Box sx={{ p: 1.5, bgcolor: '#0d1b2a', borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#a5d6a7' }}>🎯 Goal: {plan.fitnessGoal}</Typography>
                    </Box>
                  )}

                  <Grid container spacing={2}>
                    {/* Nutrition */}
                    {plan.dailyCalories && (
                      <Grid item xs={12} md={5}>
                        <Box sx={{ p: 2, bgcolor: '#0d2136', borderRadius: 1, border: '1px solid #1a3a5a' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <RestaurantIcon sx={{ color: '#ffa726', fontSize: 18 }} />
                            <Typography sx={{ color: '#ffa726', fontWeight: 600 }}>Nutrition Plan</Typography>
                          </Box>
                          <Grid container spacing={1}>
                            {[
                              { label: 'Calories', value: `${plan.dailyCalories} kcal` },
                              { label: 'Protein', value: `${plan.proteinGrams}g` },
                              { label: 'Carbs', value: `${plan.carbsGrams}g` },
                              { label: 'Fats', value: `${plan.fatsGrams}g` },
                            ].map(({ label, value }) => value && value !== 'undefinedg' && (
                              <Grid item xs={6} key={label}>
                                <Typography variant="caption" color="text.secondary">{label}</Typography>
                                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{value}</Typography>
                              </Grid>
                            ))}
                          </Grid>
                          {plan.specialDiet && <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Diet: {plan.specialDiet}</Typography>}
                          {plan.dietaryRestrictions && <Typography variant="caption" color="text.secondary">Restrictions: {plan.dietaryRestrictions}</Typography>}
                        </Box>
                      </Grid>
                    )}

                    {/* Exercises */}
                    {plan.exercises && plan.exercises.length > 0 && (
                      <Grid item xs={12} md={plan.dailyCalories ? 7 : 12}>
                        <Box sx={{ p: 2, bgcolor: '#0d2136', borderRadius: 1, border: '1px solid #1a3a5a' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <FitnessCenterIcon sx={{ color: '#90caf9', fontSize: 18 }} />
                            <Typography sx={{ color: '#90caf9', fontWeight: 600 }}>Exercise Schedule</Typography>
                          </Box>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ '& th': { color: '#a0b0c8', borderColor: '#1a2a3a', fontSize: 12 } }}>
                                <TableCell>Exercise</TableCell>
                                <TableCell>Sets × Reps</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Frequency</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {plan.exercises.map((ex, i) => (
                                <TableRow key={i} sx={{ '& td': { borderColor: '#1a2a3a', color: 'white', fontSize: 13 } }}>
                                  <TableCell sx={{ fontWeight: 600 }}>{ex.name}</TableCell>
                                  <TableCell>{ex.sets && ex.reps ? `${ex.sets} × ${ex.reps}` : ex.sets || ex.reps || '—'}</TableCell>
                                  <TableCell>{ex.duration || '—'}</TableCell>
                                  <TableCell>{ex.frequency || '—'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  {/* Progress Notes */}
                  {plan.progressNotes && (
                    <>
                      <Divider sx={{ my: 2, borderColor: '#2a3a4a' }} />
                      <Box sx={{ p: 1.5, bgcolor: '#1a3000', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <TrendingUpIcon sx={{ fontSize: 16, color: '#a5d6a7' }} />
                          <Typography variant="caption" sx={{ color: '#a5d6a7', fontWeight: 600 }}>Progress Notes</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">{plan.progressNotes}</Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyFitnessPlan;
