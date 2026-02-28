import React from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useProSidebar } from 'react-pro-sidebar';
import { useDispatch, useSelector } from 'react-redux';
import SearchUser from '../../component/SearchUser';

const COLORS = {
    navyBg: '#0A1628',
    gold: '#C9A227',
    goldLight: 'rgba(201,162,39,0.12)',
    textPrimary: '#F5F7FA',
    textSecondary: '#A0B0C8',
    border: 'rgba(201,162,39,0.12)',
    avatarBg: 'linear-gradient(135deg, #C9A227 0%, #8c6a12 100%)',
};

const HeaderTop = () => {
    const { userInfo } = useSelector(state => state.signIn);
    const { collapseSidebar, collapsed } = useProSidebar();
    const dispatch = useDispatch();

    const displayName = userInfo
        ? userInfo.firstName
            ? `${userInfo.firstName}${userInfo.lastName ? ' ' + userInfo.lastName : ''}`
            : userInfo.email
            ? userInfo.email.split('@')[0]
            : 'User'
        : 'User';

    const avatarLetter = userInfo
        ? userInfo.firstName
            ? userInfo.firstName.charAt(0).toUpperCase()
            : userInfo.email
            ? userInfo.email.charAt(0).toUpperCase()
            : 'U'
        : 'U';

    const roleLabel = userInfo && userInfo.role === 1 ? 'Admin' : 'Player';

    return (
        <Box sx={{ flexGrow: 0 }}>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    backgroundColor: COLORS.navyBg,
                    borderBottom: `1px solid ${COLORS.border}`,
                    boxShadow: 'none',
                }}
            >
                <Toolbar
                    sx={{
                        minHeight: '60px !important',
                        px: { xs: 1.5, sm: 2.5 },
                        gap: 1,
                    }}
                >
                    {/* Hamburger Toggle */}
                    <IconButton
                        onClick={() => collapseSidebar()}
                        size="medium"
                        edge="start"
                        aria-label="toggle sidebar"
                        sx={{
                            color: COLORS.textSecondary,
                            borderRadius: '8px',
                            mr: 1,
                            '&:hover': {
                                backgroundColor: COLORS.goldLight,
                                color: COLORS.gold,
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {collapsed ? (
                            <MenuIcon sx={{ fontSize: 22 }} />
                        ) : (
                            <MenuOpenIcon sx={{ fontSize: 22 }} />
                        )}
                    </IconButton>

                    {/* Center: Dashboard Title + Breadcrumb */}
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                display: { xs: 'none', sm: 'flex' },
                                alignItems: 'center',
                                gap: 0.75,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 4,
                                    height: 18,
                                    borderRadius: '2px',
                                    background: COLORS.gold,
                                    flexShrink: 0,
                                }}
                            />
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    color: COLORS.textPrimary,
                                    fontWeight: 600,
                                    fontSize: 16,
                                    letterSpacing: '0.02em',
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                            >
                                Dashboard
                            </Typography>
                        </Box>

                        {/* Breadcrumb separator - desktop only */}
                        <Typography
                            sx={{
                                display: { xs: 'none', md: 'block' },
                                color: COLORS.textSecondary,
                                fontSize: 13,
                                opacity: 0.5,
                                mx: 0.5,
                            }}
                        >
                            /
                        </Typography>

                        <Typography
                            sx={{
                                display: { xs: 'none', md: 'block' },
                                color: COLORS.textSecondary,
                                fontSize: 13,
                            }}
                        >
                            {userInfo && userInfo.role === 1 ? 'Admin Panel' : 'Player Panel'}
                        </Typography>
                    </Box>

                    {/* Right Side */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1, sm: 2 },
                        }}
                    >
                        {/* Search - Admin only */}
                        {userInfo && userInfo.role === 1 && (
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                                <SearchUser />
                            </Box>
                        )}

                        {/* Divider */}
                        <Box
                            sx={{
                                width: '1px',
                                height: 28,
                                background: COLORS.border,
                                display: { xs: 'none', sm: 'block' },
                            }}
                        />

                        {/* User Info */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.2,
                                py: 0.5,
                                px: 1.2,
                                borderRadius: '10px',
                                border: `1px solid ${COLORS.border}`,
                                background: 'rgba(255,255,255,0.02)',
                                cursor: 'default',
                                '&:hover': {
                                    background: COLORS.goldLight,
                                    borderColor: 'rgba(201,162,39,0.25)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {/* User Name - desktop only */}
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Typography
                                    sx={{
                                        color: COLORS.textPrimary,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        lineHeight: 1.3,
                                        whiteSpace: 'nowrap',
                                        maxWidth: 120,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {displayName}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: COLORS.gold,
                                        fontSize: 10.5,
                                        fontWeight: 600,
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                        lineHeight: 1,
                                    }}
                                >
                                    {roleLabel}
                                </Typography>
                            </Box>

                            {/* Avatar Circle */}
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    background: COLORS.avatarBg,
                                    color: '#0A1628',
                                    fontWeight: 700,
                                    fontSize: 13,
                                    flexShrink: 0,
                                    boxShadow: '0 2px 8px rgba(201,162,39,0.25)',
                                }}
                            >
                                {avatarLetter}
                            </Avatar>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default HeaderTop;
