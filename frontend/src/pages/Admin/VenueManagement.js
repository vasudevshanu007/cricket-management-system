import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid, Chip, IconButton, Tooltip,
  Card, CardContent, CardActions, Divider, List, ListItem, ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import axios from 'axios';
import { toast } from 'react-toastify';

const VENUE_TYPES = ["Main Ground", "Practice Ground", "Indoor Net", "Gymnasium", "Swimming Pool", "Conference Room", "Other"];
const STATUSES = ["Available", "Booked", "Under Maintenance", "Closed"];
const BOOKING_PURPOSES = ["Practice", "Match", "Tournament", "Fitness", "Meeting", "Other"];

const emptyForm = {
  name: '', type: 'Practice Ground', capacity: '', location: '',
  facilities: '', status: 'Available', contactPerson: '', contactPhone: '',
  imageUrl: '', rentalCostPerHour: 0, description: '',
};
const emptyBooking = { date: '', startTime: '', endTime: '', purpose: 'Practice', bookedBy: '', teamOrGroup: '', notes: '' };

const statusColor = { Available: 'success', Booked: 'warning', 'Under Maintenance': 'error', Closed: 'default' };

const VenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [open, setOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [booking, setBooking] = useState(emptyBooking);
  const [loading, setLoading] = useState(false);

  const fetchVenues = async () => {
    try {
      const { data } = await axios.get('/api/venues');
      setVenues(data.venues);
    } catch { toast.error('Failed to load venues'); }
  };

  useEffect(() => { fetchVenues(); }, []);

  const handleOpen = (row = null) => {
    if (row) {
      setEditId(row._id);
      setForm({ ...row, facilities: Array.isArray(row.facilities) ? row.facilities.join(', ') : row.facilities });
    } else { setEditId(null); setForm(emptyForm); }
    setOpen(true);
  };

  const handleBookingOpen = (venue) => { setSelectedVenue(venue); setBooking(emptyBooking); setBookingOpen(true); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...form, facilities: form.facilities.split(',').map(f => f.trim()).filter(Boolean) };
      if (editId) { await axios.put(`/api/venues/${editId}`, payload); toast.success('Venue updated'); }
      else { await axios.post('/api/venues', payload); toast.success('Venue added'); }
      setOpen(false);
      fetchVenues();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving venue'); }
    setLoading(false);
  };

  const handleBookingSubmit = async () => {
    if (!booking.date || !booking.startTime || !booking.endTime) { toast.warning('Date and times are required'); return; }
    setLoading(true);
    try {
      await axios.post(`/api/venues/${selectedVenue._id}/bookings`, booking);
      toast.success('Booking added');
      setBookingOpen(false);
      fetchVenues();
    } catch (err) { toast.error(err.response?.data?.message || 'Error adding booking'); }
    setLoading(false);
  };

  const handleRemoveBooking = async (venueId, bookingId) => {
    if (!window.confirm('Remove this booking?')) return;
    try {
      await axios.delete(`/api/venues/${venueId}/bookings/${bookingId}`);
      toast.success('Booking removed');
      fetchVenues();
    } catch { toast.error('Failed to remove booking'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this venue?')) return;
    try {
      await axios.delete(`/api/venues/${id}`);
      toast.success('Venue deleted');
      fetchVenues();
    } catch { toast.error('Failed to delete'); }
  };

  const available = venues.filter(v => v.status === 'Available').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Venue Management
        </Typography>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Venue</Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Card sx={{ bgcolor: '#2e7d32', flex: 1 }}>
          <CardContent sx={{ py: 1.5 }}>
            <Typography variant="h4" fontWeight={700} color="white">{available}</Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.8)">Available</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#1565c0', flex: 1 }}>
          <CardContent sx={{ py: 1.5 }}>
            <Typography variant="h4" fontWeight={700} color="white">{venues.length}</Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.8)">Total Venues</Typography>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={2}>
        {venues.length === 0 && <Grid item xs={12}><Typography color="text.secondary" align="center" sx={{ py: 6 }}>No venues added yet.</Typography></Grid>}
        {venues.map(v => (
          <Grid item xs={12} md={6} lg={4} key={v._id}>
            <Card sx={{ bgcolor: '#1a2332', border: '1px solid #2a3a4a', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white' }}>{v.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{v.type}</Typography>
                  </Box>
                  <Chip label={v.status} color={statusColor[v.status] || 'default'} size="small" />
                </Box>
                {v.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{v.location}</Typography>
                  </Box>
                )}
                {v.capacity > 0 && <Typography variant="body2" color="text.secondary">Capacity: {v.capacity}</Typography>}
                {v.rentalCostPerHour > 0 && <Typography variant="body2" color="text.secondary">Cost: LKR {v.rentalCostPerHour}/hr</Typography>}
                {v.facilities && v.facilities.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {v.facilities.map((f, i) => <Chip key={i} label={f} size="small" variant="outlined" sx={{ color: 'white', borderColor: '#4a6080', fontSize: 11 }} />)}
                  </Box>
                )}

                {v.bookings && v.bookings.length > 0 && (
                  <>
                    <Divider sx={{ my: 1, borderColor: '#2a3a4a' }} />
                    <Typography variant="caption" sx={{ color: '#90caf9' }}>Upcoming Bookings</Typography>
                    <List dense disablePadding>
                      {v.bookings.slice(0, 2).map((b, i) => (
                        <ListItem key={i} disablePadding secondaryAction={
                          <IconButton size="small" color="error" onClick={() => handleRemoveBooking(v._id, b._id)}><DeleteIcon sx={{ fontSize: 14 }} /></IconButton>
                        }>
                          <ListItemText
                            primary={<Typography variant="caption" sx={{ color: 'white' }}>{new Date(b.date).toLocaleDateString()} {b.startTime}–{b.endTime}</Typography>}
                            secondary={<Typography variant="caption" color="text.secondary">{b.purpose} • {b.bookedBy}</Typography>}
                          />
                        </ListItem>
                      ))}
                      {v.bookings.length > 2 && <Typography variant="caption" color="text.secondary">+{v.bookings.length - 2} more</Typography>}
                    </List>
                  </>
                )}
              </CardContent>
              <CardActions sx={{ pt: 0 }}>
                <Tooltip title="Add Booking"><IconButton size="small" color="success" onClick={() => handleBookingOpen(v)}><EventAvailableIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleOpen(v)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(v._id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Venue Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>{editId ? 'Edit Venue' : 'Add New Venue'}</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a', pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={8}><TextField fullWidth label="Venue Name" name="name" value={form.name} onChange={handleChange} /></Grid>
            <Grid item xs={4}>
              <TextField fullWidth select label="Type" name="type" value={form.type} onChange={handleChange}>
                {VENUE_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}><TextField fullWidth label="Location / Address" name="location" value={form.location} onChange={handleChange} /></Grid>
            <Grid item xs={3}><TextField fullWidth label="Capacity" name="capacity" type="number" value={form.capacity} onChange={handleChange} /></Grid>
            <Grid item xs={3}><TextField fullWidth label="Cost/Hour (LKR)" name="rentalCostPerHour" type="number" value={form.rentalCostPerHour} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Contact Person" name="contactPerson" value={form.contactPerson} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Contact Phone" name="contactPhone" value={form.contactPhone} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Facilities (comma-separated)" name="facilities" value={form.facilities} onChange={handleChange} placeholder="Floodlights, Changing Rooms, Scoreboard" /></Grid>
            <Grid item xs={6}>
              <TextField fullWidth select label="Status" name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}><TextField fullWidth label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Description" name="description" value={form.description} onChange={handleChange} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e2a3a' }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>{editId ? 'Update' : 'Add Venue'}</Button>
        </DialogActions>
      </Dialog>

      {/* Add Booking Dialog */}
      <Dialog open={bookingOpen} onClose={() => setBookingOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e2a3a', color: 'white' }}>
          <EventAvailableIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Book: {selectedVenue?.name}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e2a3a', pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Date" type="date" value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Start Time" type="time" value={booking.startTime} onChange={(e) => setBooking({ ...booking, startTime: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="End Time" type="time" value={booking.endTime} onChange={(e) => setBooking({ ...booking, endTime: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={6}>
              <TextField fullWidth select label="Purpose" value={booking.purpose} onChange={(e) => setBooking({ ...booking, purpose: e.target.value })}>
                {BOOKING_PURPOSES.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}><TextField fullWidth label="Booked By" value={booking.bookedBy} onChange={(e) => setBooking({ ...booking, bookedBy: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Team / Group" value={booking.teamOrGroup} onChange={(e) => setBooking({ ...booking, teamOrGroup: e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e2a3a' }}>
          <Button onClick={() => setBookingOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleBookingSubmit} disabled={loading}>Confirm Booking</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VenueManagement;
