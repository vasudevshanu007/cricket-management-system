import React, { useEffect } from 'react';
import { Sidebar, Menu, MenuItem, menuClasses, useProSidebar } from 'react-pro-sidebar';
import { Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EventIcon from '@mui/icons-material/Event';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import CategoryIcon from '@mui/icons-material/Category';
import LoginIcon from '@mui/icons-material/Login';
import SportsIcon from '@mui/icons-material/Sports';
import GroupsIcon from '@mui/icons-material/Groups';
import ArticleIcon from '@mui/icons-material/Article';
import HealingIcon from '@mui/icons-material/Healing';
import CampaignIcon from '@mui/icons-material/Campaign';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ChecklistIcon from '@mui/icons-material/Checklist';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

import { userLogoutAction, userProfileAction } from '../../redux/actions/userActions';

const COLORS = {
    navyBg: '#0D1B2A',
    navyDark: '#0A1628',
    gold: '#C9A227',
    goldLight: 'rgba(201,162,39,0.15)',
    goldHover: 'rgba(201,162,39,0.12)',
    textPrimary: '#F5F7FA',
    textSecondary: '#A0B0C8',
    border: 'rgba(201,162,39,0.15)',
    logoutHover: 'rgba(255,80,80,0.1)',
};

const SidebarAdm = () => {
    const { userInfo } = useSelector(state => state.signIn);
    const { collapsed } = useProSidebar();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(userProfileAction());
    }, []);

    const logOut = () => {
        dispatch(userLogoutAction());
        setTimeout(() => {
            navigate('/');
        }, 400);
    };

    const menuItemStyles = {
        button: {
            [`&.${menuClasses.button}`]: {
                color: COLORS.textPrimary,
                borderRadius: '8px',
                margin: '1px 8px',
                padding: '8px 12px',
                transition: 'all 0.2s ease',
            },
            [`&.${menuClasses.disabled}`]: {
                color: COLORS.textSecondary,
            },
            '&:hover': {
                backgroundColor: COLORS.goldHover,
                color: COLORS.gold,
            },
            [`&.${menuClasses.active}`]: {
                backgroundColor: COLORS.goldHover,
                color: COLORS.gold,
            },
        },
        icon: {
            [`&.${menuClasses.icon}`]: {
                color: COLORS.gold,
            },
        },
        label: {
            fontSize: '13.5px',
            fontWeight: 500,
            letterSpacing: '0.01em',
        },
    };

    const logoutMenuItemStyles = {
        button: {
            [`&.${menuClasses.button}`]: {
                color: '#ff8a8a',
                borderRadius: '8px',
                margin: '1px 8px',
                padding: '8px 12px',
                transition: 'all 0.2s ease',
            },
            '&:hover': {
                backgroundColor: COLORS.logoutHover,
                color: '#ff5c5c',
            },
        },
        icon: {
            [`&.${menuClasses.icon}`]: {
                color: '#ff8a8a',
            },
        },
    };

    return (
        <Sidebar
            backgroundColor={COLORS.navyBg}
            style={{
                borderRight: `1px solid ${COLORS.border}`,
                minHeight: '100vh',
            }}
            rootStyles={{
                '.ps-sidebar-container': {
                    backgroundColor: COLORS.navyBg,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                    height: '100%',
                    minHeight: '100vh',
                }}
            >
                {/* Top: Logo + Menu */}
                <Box>
                    {/* Logo */}
                    <Box
                        sx={{
                            pt: 3,
                            pb: 3,
                            px: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            borderBottom: `1px solid ${COLORS.border}`,
                            mb: 1.5,
                        }}
                    >
                        <Link
                            to="/"
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: collapsed ? 0 : '10px',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: '10px',
                                    background: `linear-gradient(135deg, ${COLORS.gold} 0%, #8c6a12 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 18,
                                    flexShrink: 0,
                                    boxShadow: `0 2px 10px rgba(201,162,39,0.3)`,
                                }}
                            >
                                🏏
                            </Box>
                            {!collapsed && (
                                <Typography
                                    sx={{
                                        color: COLORS.gold,
                                        fontWeight: 700,
                                        fontSize: 17,
                                        letterSpacing: '0.1em',
                                        fontFamily: "'Poppins', sans-serif",
                                        lineHeight: 1,
                                    }}
                                >
                                    CricINDIA
                                </Typography>
                            )}
                        </Link>
                    </Box>

                    {/* Role Label */}
                    {!collapsed && (
                        <Box sx={{ px: 2.5, mb: 1 }}>
                            <Typography
                                sx={{
                                    color: COLORS.textSecondary,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    opacity: 0.7,
                                }}
                            >
                                {userInfo && userInfo.role === 1 ? 'Admin Panel' : 'Player Panel'}
                            </Typography>
                        </Box>
                    )}

                    {/* Navigation Menu */}
                    <Menu menuItemStyles={menuItemStyles}>
                        {userInfo && userInfo.role === 1 ? (
                            <>
                                <MenuItem component={<Link to="/admin/dashboard" />} icon={<DashboardIcon />}>
                                    Dashboard
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/users" />} icon={<GroupAddIcon />}>
                                    Players
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/psessions" />} icon={<SportsCricketIcon />}>
                                    Practice Sessions
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/PPerformance" />} icon={<TrendingUpIcon />}>
                                    Player Performance
                                </MenuItem>
                                <MenuItem component={<Link to="/Coach/" />} icon={<GroupIcon />}>
                                    Coaches
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/events" />} icon={<EmojiEventsIcon />}>
                                    Events
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/category" />} icon={<CategoryIcon />}>
                                    Categories
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/itemdash" />} icon={<SportsTennisIcon />}>
                                    Equipment
                                </MenuItem>
                                <MenuItem component={<Link to="/adminDash" />} icon={<AccountBalanceIcon />}>
                                    Financial
                                </MenuItem>
                                <MenuItem component={<Link to="/AddEvent" />} icon={<SportsCricketIcon />}>
                                    Match Coordination
                                </MenuItem>
                                <MenuItem component={<Link to="/eventdash" />} icon={<EventIcon />}>
                                    All Matches
                                </MenuItem>

                                {/* ── Advanced Features ── */}
                                {!collapsed && (
                                    <Box sx={{ px: 2.5, pt: 2, pb: 0.5 }}>
                                        <Typography sx={{ color: COLORS.textSecondary, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6 }}>
                                            Advanced
                                        </Typography>
                                    </Box>
                                )}
                                <MenuItem component={<Link to="/admin/matches" />} icon={<SportsIcon />}>
                                    Match Management
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/teams" />} icon={<GroupsIcon />}>
                                    Team Management
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/tournaments" />} icon={<WorkspacePremiumIcon />}>
                                    Tournaments
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/injuries" />} icon={<HealingIcon />}>
                                    Injury Tracker
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/contracts" />} icon={<ArticleIcon />}>
                                    Contracts
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/announcements" />} icon={<CampaignIcon />}>
                                    Announcements
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/scouts" />} icon={<PersonSearchIcon />}>
                                    Scouting
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/attendance" />} icon={<ChecklistIcon />}>
                                    Attendance
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/venues" />} icon={<LocationOnIcon />}>
                                    Venues
                                </MenuItem>
                                <MenuItem component={<Link to="/admin/fitness" />} icon={<FitnessCenterIcon />}>
                                    Fitness Plans
                                </MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem component={<Link to="/user/dashboard" />} icon={<DashboardIcon />}>
                                    Dashboard
                                </MenuItem>
                                <MenuItem component={<Link to="/user/info" />} icon={<PersonIcon />}>
                                    Personal Info
                                </MenuItem>
                                <MenuItem component={<Link to="/user/myperformance" />} icon={<TrendingUpIcon />}>
                                    My Performance
                                </MenuItem>
                                <MenuItem component={<Link to="/dashboard" />} icon={<SportsTennisIcon />}>
                                    Equipment
                                </MenuItem>
                                <MenuItem component={<Link to="/userSalary" />} icon={<AccountBalanceIcon />}>
                                    Financial
                                </MenuItem>
                                <MenuItem component={<Link to="/eventpage" />} icon={<EventIcon />}>
                                    Match Coordination
                                </MenuItem>
                                <MenuItem component={<Link to="/user/show/coaches" />} icon={<GroupIcon />}>
                                    Coaches
                                </MenuItem>

                                {/* ── Advanced Features ── */}
                                {!collapsed && (
                                    <Box sx={{ px: 2.5, pt: 2, pb: 0.5 }}>
                                        <Typography sx={{ color: COLORS.textSecondary, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6 }}>
                                            Advanced
                                        </Typography>
                                    </Box>
                                )}
                                <MenuItem component={<Link to="/matches" />} icon={<SportsIcon />}>
                                    Match Results
                                </MenuItem>
                                <MenuItem component={<Link to="/tournaments" />} icon={<LeaderboardIcon />}>
                                    Standings
                                </MenuItem>
                                <MenuItem component={<Link to="/announcements" />} icon={<CampaignIcon />}>
                                    Announcements
                                </MenuItem>
                                <MenuItem component={<Link to="/my-fitness" />} icon={<FitnessCenterIcon />}>
                                    Fitness Plan
                                </MenuItem>
                            </>
                        )}
                    </Menu>
                </Box>

                {/* Bottom: User info + Logout */}
                <Box sx={{ pb: 2 }}>
                    {/* User Info Card */}
                    {!collapsed && userInfo && (
                        <Box
                            sx={{
                                mx: 2,
                                mb: 1.5,
                                p: 1.5,
                                borderRadius: '10px',
                                background: 'rgba(255,255,255,0.03)',
                                border: `1px solid ${COLORS.border}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${COLORS.gold} 0%, #8c6a12 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: '#0A1628',
                                }}
                            >
                                {userInfo.firstName
                                    ? userInfo.firstName.charAt(0).toUpperCase()
                                    : userInfo.email
                                    ? userInfo.email.charAt(0).toUpperCase()
                                    : 'U'}
                            </Box>
                            <Box sx={{ overflow: 'hidden' }}>
                                <Typography
                                    sx={{
                                        color: COLORS.textPrimary,
                                        fontSize: 12.5,
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {userInfo.firstName
                                        ? `${userInfo.firstName} ${userInfo.lastName || ''}`
                                        : userInfo.email}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: COLORS.gold,
                                        fontSize: 10.5,
                                        fontWeight: 600,
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {userInfo.role === 1 ? 'Administrator' : 'Player'}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* Divider */}
                    <Box
                        sx={{
                            mx: 2,
                            mb: 1,
                            height: '1px',
                            background: COLORS.border,
                        }}
                    />

                    {/* Logout */}
                    <Menu menuItemStyles={logoutMenuItemStyles}>
                        <MenuItem onClick={logOut} icon={<LoginIcon />}>
                            Log Out
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>
        </Sidebar>
    );
};

export default SidebarAdm;
