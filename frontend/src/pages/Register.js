import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { userSignUpAction } from '../redux/actions/userActions';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const COLORS = {
    navyBg: '#0D1B2A',
    navyDark: '#0A1628',
    navyMid: '#1B2A4A',
    gold: '#C9A227',
    goldLight: 'rgba(201,162,39,0.15)',
    textPrimary: '#F5F7FA',
    textSecondary: '#A0B0C8',
    borderSubtle: 'rgba(201,162,39,0.2)',
    inputBg: 'rgba(255,255,255,0.04)',
    inputBorder: 'rgba(160,176,200,0.3)',
};

const validationSchema = yup.object({
    firstName: yup.string('Enter your First Name').required('First Name is required'),
    lastName: yup.string('Enter your Last Name').required('Last Name is required'),
    dateOfBirth: yup.date().max(new Date(), 'Date of birth cannot be in the future'),
    gender: yup.string(),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(8, 'Password should be at least 8 characters').required('Password is required'),
    phoneNumber: yup
        .string()
        .matches(/^[0-9]{10}$/, 'Please add a valid 10-digit Phone Number')
        .required('Phone Number is required'),
    cricketExperience: yup.string(),
    battingStyle: yup.string(),
    bowlingStyle: yup.string(),
    wicketkeepingExperience: yup.boolean(),
    guardianName: yup.string(),
    guardianRelation: yup.string(),
    guardianTp: yup.string().matches(/^[0-9]{10}$/, 'Please add a valid 10-digit Phone Number'),
    preferredPlayingPosition: yup.string(),
});

const featureBullets = [
    {
        icon: <SportsCricketIcon sx={{ color: COLORS.gold, fontSize: 20 }} />,
        title: 'Join the Franchise',
        desc: 'Become part of a professional cricket management ecosystem.',
    },
    {
        icon: <TrendingUpIcon sx={{ color: COLORS.gold, fontSize: 20 }} />,
        title: 'Track Your Growth',
        desc: 'Monitor personal performance metrics and development milestones.',
    },
    {
        icon: <EmojiEventsIcon sx={{ color: COLORS.gold, fontSize: 20 }} />,
        title: 'Compete in Events',
        desc: 'Register for tournaments, trials and franchise-level events.',
    },
    {
        icon: <AccountBalanceIcon sx={{ color: COLORS.gold, fontSize: 20 }} />,
        title: 'Financial Transparency',
        desc: 'Access salary slips and financial records with ease.',
    },
];

const inputSx = {
    mb: 2.5,
    '& .MuiOutlinedInput-root': {
        backgroundColor: COLORS.inputBg,
        borderRadius: '10px',
        '& fieldset': { borderColor: COLORS.inputBorder },
        '&:hover fieldset': { borderColor: COLORS.gold },
        '&.Mui-focused fieldset': { borderColor: COLORS.gold, borderWidth: '1.5px' },
        '& input': { color: COLORS.textPrimary },
        '& input::placeholder': { color: COLORS.textSecondary, opacity: 1 },
    },
    '& .MuiInputLabel-root': { color: COLORS.textSecondary },
    '& .MuiInputLabel-root.Mui-focused': { color: COLORS.gold },
    '& .MuiFormHelperText-root': { color: '#ff6b6b' },
    '& .MuiIconButton-root': { color: COLORS.textSecondary },
};

const selectSx = {
    mb: 2.5,
    '& .MuiOutlinedInput-root': {
        backgroundColor: COLORS.inputBg,
        borderRadius: '10px',
        color: COLORS.textPrimary,
        '& fieldset': { borderColor: COLORS.inputBorder },
        '&:hover fieldset': { borderColor: COLORS.gold },
        '&.Mui-focused fieldset': { borderColor: COLORS.gold, borderWidth: '1.5px' },
    },
    '& .MuiInputLabel-root': { color: COLORS.textSecondary },
    '& .MuiInputLabel-root.Mui-focused': { color: COLORS.gold },
    '& .MuiSelect-icon': { color: COLORS.textSecondary },
    '& .MuiFormHelperText-root': { color: '#ff6b6b' },
};

const SectionLabel = ({ children }) => (
    <Typography
        sx={{
            color: COLORS.gold,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            mb: 1.5,
            mt: 1,
            borderBottom: `1px solid rgba(201,162,39,0.15)`,
            pb: 0.75,
        }}
    >
        {children}
    </Typography>
);

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector(state => state.signIn);

    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            email: '',
            password: '',
            phoneNumber: '',
            cricketExperience: '',
            battingStyle: '',
            bowlingStyle: '',
            wicketkeepingExperience: false,
            guardianName: '',
            guardianRelation: '',
            guardianTp: '',
            preferredPlayingPosition: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, actions) => {
            dispatch(userSignUpAction(values));
            actions.resetForm();
        },
    });

    const handleClickShowPassword = () => setShowPassword(prev => !prev);
    const handleMouseDownPassword = (event) => event.preventDefault();

    return (
        <>
            <style>{`
                html, body, #root {
                    margin: 0;
                    padding: 0;
                    background-color: ${COLORS.navyBg};
                }
                .register-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: row;
                    background-color: ${COLORS.navyBg};
                }
                .register-left-panel {
                    display: none;
                }
                @media (min-width: 768px) {
                    .register-left-panel {
                        display: flex;
                    }
                }
                .register-right-panel {
                    flex: 1;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding: 40px 24px;
                    overflow-y: auto;
                    background-color: ${COLORS.navyBg};
                }
                .decorative-circle-r1 {
                    position: absolute;
                    width: 280px;
                    height: 280px;
                    border-radius: 50%;
                    border: 1px solid rgba(201,162,39,0.08);
                    top: -50px;
                    right: -70px;
                }
                .decorative-circle-r2 {
                    position: absolute;
                    width: 180px;
                    height: 180px;
                    border-radius: 50%;
                    border: 1px solid rgba(201,162,39,0.1);
                    bottom: 100px;
                    left: -50px;
                }
                .decorative-circle-r3 {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: rgba(201,162,39,0.04);
                    top: 45%;
                    right: 8%;
                }
                .mui-select-paper .MuiMenuItem-root {
                    color: ${COLORS.textPrimary} !important;
                    background-color: ${COLORS.navyMid} !important;
                }
                .mui-select-paper .MuiMenuItem-root:hover {
                    background-color: rgba(201,162,39,0.12) !important;
                    color: ${COLORS.gold} !important;
                }
            `}</style>

            <div className="register-container">
                {/* Left Panel - Branding */}
                <div
                    className="register-left-panel"
                    style={{
                        width: '40%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        padding: '60px 48px',
                        background: `linear-gradient(145deg, ${COLORS.navyDark} 0%, ${COLORS.navyMid} 100%)`,
                        borderRight: `1px solid ${COLORS.borderSubtle}`,
                        position: 'relative',
                        overflow: 'hidden',
                        minHeight: '100vh',
                    }}
                >
                    <div className="decorative-circle-r1" />
                    <div className="decorative-circle-r2" />
                    <div className="decorative-circle-r3" />

                    {/* Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, zIndex: 1, position: 'relative' }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '12px',
                                background: `linear-gradient(135deg, ${COLORS.gold} 0%, #a07c1a 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 1.5,
                                fontSize: 22,
                                boxShadow: `0 4px 16px rgba(201,162,39,0.35)`,
                            }}
                        >
                            🏏
                        </Box>
                        <Typography
                            variant="h5"
                            sx={{
                                color: COLORS.gold,
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                fontFamily: "'Poppins', sans-serif",
                            }}
                        >
                            CricINDIA
                        </Typography>
                    </Box>

                    {/* Join the Franchise Badge */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 2,
                            py: 0.75,
                            borderRadius: '20px',
                            border: `1px solid ${COLORS.goldLight}`,
                            background: 'rgba(201,162,39,0.07)',
                            mb: 3,
                            zIndex: 1,
                            position: 'relative',
                        }}
                    >
                        <Box
                            sx={{
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                background: COLORS.gold,
                                mr: 1,
                                boxShadow: `0 0 6px ${COLORS.gold}`,
                            }}
                        />
                        <Typography sx={{ color: COLORS.gold, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em' }}>
                            JOIN THE FRANCHISE
                        </Typography>
                    </Box>

                    {/* Headline */}
                    <Typography
                        variant="h3"
                        sx={{
                            color: COLORS.textPrimary,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            mb: 1.5,
                            zIndex: 1,
                            position: 'relative',
                            fontFamily: "'Poppins', sans-serif",
                        }}
                    >
                        Start Your
                    </Typography>
                    <Typography
                        variant="h3"
                        sx={{
                            color: COLORS.gold,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            mb: 3,
                            zIndex: 1,
                            position: 'relative',
                            fontFamily: "'Poppins', sans-serif",
                        }}
                    >
                        Cricket Journey
                    </Typography>
                    <Typography
                        sx={{
                            color: COLORS.textSecondary,
                            fontSize: 14.5,
                            lineHeight: 1.7,
                            mb: 5,
                            maxWidth: 340,
                            zIndex: 1,
                            position: 'relative',
                        }}
                    >
                        Register as a player and gain access to the complete CricINDIA franchise management platform.
                    </Typography>

                    {/* Feature Bullets */}
                    <Box sx={{ zIndex: 1, position: 'relative', width: '100%' }}>
                        {featureBullets.map((feat, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    mb: 2.5,
                                    p: 1.75,
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        background: 'rgba(201,162,39,0.06)',
                                        border: `1px solid ${COLORS.goldLight}`,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 34,
                                        height: 34,
                                        borderRadius: '8px',
                                        background: 'rgba(201,162,39,0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 1.5,
                                        flexShrink: 0,
                                    }}
                                >
                                    {feat.icon}
                                </Box>
                                <Box>
                                    <Typography sx={{ color: COLORS.textPrimary, fontWeight: 600, fontSize: 13.5, mb: 0.2 }}>
                                        {feat.title}
                                    </Typography>
                                    <Typography sx={{ color: COLORS.textSecondary, fontSize: 12, lineHeight: 1.5 }}>
                                        {feat.desc}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </div>

                {/* Right Panel - Registration Form */}
                <div className="register-right-panel">
                    <Box sx={{ width: '100%', maxWidth: 540, py: 2 }}>
                        {/* Mobile Logo */}
                        <Box
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '10px',
                                    background: `linear-gradient(135deg, ${COLORS.gold} 0%, #a07c1a 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 1.2,
                                    fontSize: 19,
                                }}
                            >
                                🏏
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{ color: COLORS.gold, fontWeight: 700, letterSpacing: '0.06em' }}
                            >
                                CricINDIA
                            </Typography>
                        </Box>

                        {/* Form Header */}
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    color: COLORS.textPrimary,
                                    fontWeight: 700,
                                    mb: 0.75,
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                            >
                                Create Account
                            </Typography>
                            <Typography sx={{ color: COLORS.textSecondary, fontSize: 14 }}>
                                Fill in your details to join the CricINDIA franchise
                            </Typography>
                        </Box>

                        {/* Form */}
                        <Box component="form" onSubmit={formik.handleSubmit}>

                            {/* Personal Information */}
                            <SectionLabel>Personal Information</SectionLabel>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        sx={inputSx}
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        name="firstName"
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="First Name"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                        helperText={formik.touched.firstName && formik.errors.firstName}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        sx={inputSx}
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="Last Name"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                        helperText={formik.touched.lastName && formik.errors.lastName}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        sx={inputSx}
                                        fullWidth
                                        id="dateOfBirth"
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        value={formik.values.dateOfBirth}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                                        helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl sx={selectSx} fullWidth>
                                        <InputLabel id="gender-label">Gender</InputLabel>
                                        <Select
                                            labelId="gender-label"
                                            id="gender"
                                            name="gender"
                                            label="Gender"
                                            value={formik.values.gender}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: COLORS.navyMid,
                                                        border: `1px solid ${COLORS.goldLight}`,
                                                        '& .MuiMenuItem-root': {
                                                            color: COLORS.textPrimary,
                                                            '&:hover': { bgcolor: 'rgba(201,162,39,0.12)', color: COLORS.gold },
                                                            '&.Mui-selected': { bgcolor: 'rgba(201,162,39,0.18)', color: COLORS.gold },
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* Contact & Account */}
                            <SectionLabel>Contact & Account</SectionLabel>

                            <TextField
                                sx={inputSx}
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                InputLabelProps={{ shrink: true }}
                                placeholder="you@example.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />

                            <TextField
                                sx={inputSx}
                                fullWidth
                                id="password"
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                InputLabelProps={{ shrink: true }}
                                placeholder="Minimum 8 characters"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                sx={{ color: COLORS.textSecondary }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                sx={inputSx}
                                fullWidth
                                id="phoneNumber"
                                label="Phone Number"
                                name="phoneNumber"
                                InputLabelProps={{ shrink: true }}
                                placeholder="10-digit phone number"
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                            />

                            {/* Cricket Profile */}
                            <SectionLabel>Cricket Profile</SectionLabel>

                            <FormControl sx={selectSx} fullWidth>
                                <InputLabel id="cricket-experience-label">Cricket Experience</InputLabel>
                                <Select
                                    labelId="cricket-experience-label"
                                    id="cricketExperience"
                                    name="cricketExperience"
                                    label="Cricket Experience"
                                    value={formik.values.cricketExperience}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                bgcolor: COLORS.navyMid,
                                                border: `1px solid ${COLORS.goldLight}`,
                                                '& .MuiMenuItem-root': {
                                                    color: COLORS.textPrimary,
                                                    '&:hover': { bgcolor: 'rgba(201,162,39,0.12)', color: COLORS.gold },
                                                    '&.Mui-selected': { bgcolor: 'rgba(201,162,39,0.18)', color: COLORS.gold },
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="Beginner">Beginner</MenuItem>
                                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                                    <MenuItem value="Advanced">Advanced</MenuItem>
                                </Select>
                            </FormControl>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl sx={selectSx} fullWidth>
                                        <InputLabel id="battingStyle-label">Batting Style</InputLabel>
                                        <Select
                                            labelId="battingStyle-label"
                                            id="battingStyle"
                                            name="battingStyle"
                                            label="Batting Style"
                                            value={formik.values.battingStyle}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: COLORS.navyMid,
                                                        border: `1px solid ${COLORS.goldLight}`,
                                                        '& .MuiMenuItem-root': {
                                                            color: COLORS.textPrimary,
                                                            '&:hover': { bgcolor: 'rgba(201,162,39,0.12)', color: COLORS.gold },
                                                            '&.Mui-selected': { bgcolor: 'rgba(201,162,39,0.18)', color: COLORS.gold },
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="Right-handed">Right-handed</MenuItem>
                                            <MenuItem value="Left-handed">Left-handed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl sx={selectSx} fullWidth>
                                        <InputLabel id="bowlingStyle-label">Bowling Style</InputLabel>
                                        <Select
                                            labelId="bowlingStyle-label"
                                            id="bowlingStyle"
                                            name="bowlingStyle"
                                            label="Bowling Style"
                                            value={formik.values.bowlingStyle}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: COLORS.navyMid,
                                                        border: `1px solid ${COLORS.goldLight}`,
                                                        '& .MuiMenuItem-root': {
                                                            color: COLORS.textPrimary,
                                                            '&:hover': { bgcolor: 'rgba(201,162,39,0.12)', color: COLORS.gold },
                                                            '&.Mui-selected': { bgcolor: 'rgba(201,162,39,0.18)', color: COLORS.gold },
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="Right-handed">Right-handed</MenuItem>
                                            <MenuItem value="Left-handed">Left-handed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <FormControl sx={selectSx} fullWidth>
                                <InputLabel id="preferred-playing-position-label">Preferred Playing Position</InputLabel>
                                <Select
                                    labelId="preferred-playing-position-label"
                                    id="preferredPlayingPosition"
                                    name="preferredPlayingPosition"
                                    label="Preferred Playing Position"
                                    value={formik.values.preferredPlayingPosition}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                bgcolor: COLORS.navyMid,
                                                border: `1px solid ${COLORS.goldLight}`,
                                                '& .MuiMenuItem-root': {
                                                    color: COLORS.textPrimary,
                                                    '&:hover': { bgcolor: 'rgba(201,162,39,0.12)', color: COLORS.gold },
                                                    '&.Mui-selected': { bgcolor: 'rgba(201,162,39,0.18)', color: COLORS.gold },
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="Batsman">Batsman</MenuItem>
                                    <MenuItem value="Bowler">Bowler</MenuItem>
                                    <MenuItem value="All-rounder">All-rounder</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        id="wicketkeepingExperience"
                                        name="wicketkeepingExperience"
                                        checked={formik.values.wicketkeepingExperience}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        sx={{
                                            color: COLORS.textSecondary,
                                            '&.Mui-checked': { color: COLORS.gold },
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={{ color: COLORS.textSecondary, fontSize: 14 }}>
                                        I have wicketkeeping experience
                                    </Typography>
                                }
                                sx={{ mb: 2.5 }}
                            />

                            {/* Guardian Information */}
                            <SectionLabel>Guardian Information</SectionLabel>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        sx={inputSx}
                                        fullWidth
                                        id="guardianName"
                                        label="Guardian Name"
                                        name="guardianName"
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="Guardian Name"
                                        value={formik.values.guardianName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.guardianName && Boolean(formik.errors.guardianName)}
                                        helperText={formik.touched.guardianName && formik.errors.guardianName}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        sx={inputSx}
                                        fullWidth
                                        id="guardianRelation"
                                        label="Relation"
                                        name="guardianRelation"
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="e.g. Father, Mother"
                                        value={formik.values.guardianRelation}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.guardianRelation && Boolean(formik.errors.guardianRelation)}
                                        helperText={formik.touched.guardianRelation && formik.errors.guardianRelation}
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                sx={inputSx}
                                fullWidth
                                id="guardianTp"
                                label="Guardian Phone Number"
                                name="guardianTp"
                                InputLabelProps={{ shrink: true }}
                                placeholder="10-digit phone number"
                                value={formik.values.guardianTp}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.guardianTp && Boolean(formik.errors.guardianTp)}
                                helperText={formik.touched.guardianTp && formik.errors.guardianTp}
                            />

                            {/* Submit */}
                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                disabled={loading}
                                sx={{
                                    mt: 1.5,
                                    mb: 3,
                                    py: 1.5,
                                    borderRadius: '10px',
                                    background: `linear-gradient(135deg, ${COLORS.gold} 0%, #a07c1a 100%)`,
                                    color: '#0A1628',
                                    fontWeight: 700,
                                    fontSize: 15,
                                    letterSpacing: '0.04em',
                                    textTransform: 'none',
                                    boxShadow: `0 4px 16px rgba(201,162,39,0.3)`,
                                    '&:hover': {
                                        background: `linear-gradient(135deg, #d4aa2c 0%, #b8891e 100%)`,
                                        boxShadow: `0 6px 20px rgba(201,162,39,0.45)`,
                                        transform: 'translateY(-1px)',
                                    },
                                    '&:disabled': {
                                        background: 'rgba(201,162,39,0.4)',
                                        color: 'rgba(10,22,40,0.6)',
                                    },
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={22} sx={{ color: '#0A1628' }} />
                                ) : (
                                    'Create Account'
                                )}
                            </Button>

                            {/* Divider */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box sx={{ flex: 1, height: '1px', background: 'rgba(160,176,200,0.15)' }} />
                                <Typography sx={{ px: 2, color: COLORS.textSecondary, fontSize: 12 }}>
                                    Already have an account?
                                </Typography>
                                <Box sx={{ flex: 1, height: '1px', background: 'rgba(160,176,200,0.15)' }} />
                            </Box>

                            {/* Login Link */}
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Link
                                    to="/login"
                                    style={{
                                        color: COLORS.gold,
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        fontSize: 14,
                                        border: `1px solid ${COLORS.goldLight}`,
                                        borderRadius: '10px',
                                        padding: '10px 24px',
                                        display: 'inline-block',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(201,162,39,0.08)';
                                        e.currentTarget.style.borderColor = COLORS.gold;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = COLORS.goldLight;
                                    }}
                                >
                                    Sign In Instead
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                </div>
            </div>
        </>
    );
};

export default Register;
