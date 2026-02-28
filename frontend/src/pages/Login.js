import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Typography,
    CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { userSignInAction } from '../redux/actions/userActions';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const COLORS = {
    navyBg: '#0D1B2A',
    navyDark: '#0A1628',
    navyMid: '#1B2A4A',
    gold: '#C9A227',
    goldLight: 'rgba(201,162,39,0.15)',
    goldHover: 'rgba(201,162,39,0.08)',
    textPrimary: '#F5F7FA',
    textSecondary: '#A0B0C8',
    borderSubtle: 'rgba(201,162,39,0.2)',
    inputBg: 'rgba(255,255,255,0.04)',
    inputBorder: 'rgba(160,176,200,0.3)',
};

const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
});

const featureBullets = [
    {
        icon: <TrendingUpIcon sx={{ color: COLORS.gold, fontSize: 20 }} />,
        title: 'Performance Analytics',
        desc: 'Track batting, bowling and fielding stats in real-time.',
    },
    {
        icon: <SportsCricketIcon sx={{ color: COLORS.gold, fontSize: 20 }} />,
        title: 'Practice Management',
        desc: 'Schedule and manage training sessions effortlessly.',
    },
    {
        icon: <EmojiEventsIcon sx={{ color: COLORS.gold, fontSize: 20 }} />,
        title: 'Events & Tournaments',
        desc: 'Organise matches, events and track tournament progress.',
    },
    {
        icon: <AccountBalanceIcon sx={{ color: COLORS.gold, fontSize: 20 }} />,
        title: 'Financial Dashboard',
        desc: 'Manage player salaries and franchise financials.',
    },
];

const LogIn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, userInfo, loading } = useSelector(state => state.signIn);

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated && userInfo) {
            if (userInfo.role === 0) {
                navigate('/user/dashboard');
            } else {
                navigate('/admin/dashboard');
            }
        }
    }, [isAuthenticated, userInfo, navigate]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, actions) => {
            dispatch(userSignInAction(values));
            actions.resetForm();
        },
    });

    const handleClickShowPassword = () => setShowPassword(prev => !prev);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const inputSx = {
        mb: 2.5,
        '& .MuiOutlinedInput-root': {
            backgroundColor: COLORS.inputBg,
            borderRadius: '10px',
            '& fieldset': {
                borderColor: COLORS.inputBorder,
            },
            '&:hover fieldset': {
                borderColor: COLORS.gold,
            },
            '&.Mui-focused fieldset': {
                borderColor: COLORS.gold,
                borderWidth: '1.5px',
            },
            '& input': {
                color: COLORS.textPrimary,
            },
            '& input::placeholder': {
                color: COLORS.textSecondary,
                opacity: 1,
            },
        },
        '& .MuiInputLabel-root': {
            color: COLORS.textSecondary,
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: COLORS.gold,
        },
        '& .MuiFormHelperText-root': {
            color: '#ff6b6b',
        },
        '& .MuiIconButton-root': {
            color: COLORS.textSecondary,
        },
    };

    return (
        <>
            <style>{`
                html, body, #root {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    background-color: ${COLORS.navyBg};
                }
                .login-left-panel {
                    display: none;
                }
                @media (min-width: 768px) {
                    .login-left-panel {
                        display: flex;
                    }
                }
                .login-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: row;
                    background-color: ${COLORS.navyBg};
                }
                .login-right-panel {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 24px;
                    min-height: 100vh;
                    background-color: ${COLORS.navyBg};
                }
                .decorative-circle-1 {
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    border-radius: 50%;
                    border: 1px solid rgba(201,162,39,0.08);
                    top: -60px;
                    right: -80px;
                }
                .decorative-circle-2 {
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    border: 1px solid rgba(201,162,39,0.12);
                    bottom: 80px;
                    left: -60px;
                }
                .decorative-circle-3 {
                    position: absolute;
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: rgba(201,162,39,0.04);
                    top: 40%;
                    right: 10%;
                }
            `}</style>

            <div className="login-container">
                {/* Left Panel - Branding */}
                <div
                    className="login-left-panel"
                    style={{
                        width: '45%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        padding: '60px 56px',
                        background: `linear-gradient(145deg, ${COLORS.navyDark} 0%, ${COLORS.navyMid} 100%)`,
                        borderRight: `1px solid ${COLORS.borderSubtle}`,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div className="decorative-circle-1" />
                    <div className="decorative-circle-2" />
                    <div className="decorative-circle-3" />

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

                    {/* Welcome Back Badge */}
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
                            WELCOME BACK
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
                        Manage Your
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
                        Cricket Franchise
                    </Typography>
                    <Typography
                        sx={{
                            color: COLORS.textSecondary,
                            fontSize: 15,
                            lineHeight: 1.7,
                            mb: 5,
                            maxWidth: 360,
                            zIndex: 1,
                            position: 'relative',
                        }}
                    >
                        The complete platform for professional cricket franchise operations, player development and performance tracking.
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
                                    p: 2,
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
                                        width: 36,
                                        height: 36,
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
                                    <Typography sx={{ color: COLORS.textPrimary, fontWeight: 600, fontSize: 14, mb: 0.3 }}>
                                        {feat.title}
                                    </Typography>
                                    <Typography sx={{ color: COLORS.textSecondary, fontSize: 12.5, lineHeight: 1.5 }}>
                                        {feat.desc}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </div>

                {/* Right Panel - Login Form */}
                <div className="login-right-panel">
                    <Box sx={{ width: '100%', maxWidth: 420 }}>
                        {/* Mobile Logo */}
                        <Box
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 4,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: '10px',
                                    background: `linear-gradient(135deg, ${COLORS.gold} 0%, #a07c1a 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 1.2,
                                    fontSize: 20,
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
                                    mb: 1,
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                            >
                                Sign In
                            </Typography>
                            <Typography sx={{ color: COLORS.textSecondary, fontSize: 14 }}>
                                Enter your credentials to access your dashboard
                            </Typography>
                        </Box>

                        {/* Form */}
                        <Box component="form" onSubmit={formik.handleSubmit}>
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
                                name="password"
                                label="Password"
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

                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                disabled={loading}
                                sx={{
                                    mt: 1,
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
                                    'Sign In'
                                )}
                            </Button>

                            {/* Divider */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 3,
                                }}
                            >
                                <Box sx={{ flex: 1, height: '1px', background: 'rgba(160,176,200,0.15)' }} />
                                <Typography sx={{ px: 2, color: COLORS.textSecondary, fontSize: 12 }}>
                                    New to CricINDIA?
                                </Typography>
                                <Box sx={{ flex: 1, height: '1px', background: 'rgba(160,176,200,0.15)' }} />
                            </Box>

                            {/* Register Link */}
                            <Box sx={{ textAlign: 'center' }}>
                                <Link
                                    to="/register"
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
                                    Create an Account
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                </div>
            </div>
        </>
    );
};

export default LogIn;
