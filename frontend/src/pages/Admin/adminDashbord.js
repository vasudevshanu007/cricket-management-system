import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  ListItemIcon,
  MenuList,
  Pagination,
  Stack,
  Typography,
  MenuItem,
} from '@mui/material';
import UserCardElement from '../../component/UserCardElement';
import { allUserAction } from '../../redux/actions/userActions';
import LoadingBox from '../../component/lLoadingBox';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';

// ─── Color Tokens ────────────────────────────────────────────────────────────
const COLORS = {
  bg: '#0D1B2A',
  card: '#1B2A4A',
  cardHover: '#22335A',
  gold: '#C9A227',
  goldLight: '#E8C547',
  textPrimary: '#F5F7FA',
  textSecondary: '#A0B0C8',
  border: 'rgba(201,162,39,0.25)',
  divider: 'rgba(160,176,200,0.12)',
};

// ─── KPI Stat Card ────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon }) => (
  <Box
    sx={{
      flex: '1 1 180px',
      background: COLORS.card,
      borderRadius: '10px',
      borderTop: `3px solid ${COLORS.gold}`,
      p: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
      },
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Typography
        sx={{
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: COLORS.textSecondary,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ fontSize: '22px', lineHeight: 1 }}>{icon}</Box>
    </Box>
    <Typography
      sx={{
        fontSize: '36px',
        fontWeight: 800,
        color: COLORS.gold,
        lineHeight: 1.1,
      }}
    >
      {value ?? 0}
    </Typography>
  </Box>
);

// ─── Filter Section Card ──────────────────────────────────────────────────────
const FilterCard = ({ title, icon, children }) => (
  <Box
    sx={{
      background: COLORS.card,
      borderRadius: '10px',
      border: `1px solid ${COLORS.border}`,
      overflow: 'hidden',
      mb: 3,
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    }}
  >
    {/* Card header */}
    <Box
      sx={{
        px: 2.5,
        py: 1.8,
        borderBottom: `1px solid ${COLORS.divider}`,
        display: 'flex',
        alignItems: 'center',
        gap: 1.2,
      }}
    >
      <Box sx={{ color: COLORS.gold, display: 'flex', alignItems: 'center' }}>{icon}</Box>
      <Typography
        sx={{
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: COLORS.textPrimary,
        }}
      >
        {title}
      </Typography>
    </Box>

    {/* Card body */}
    <Box sx={{ px: 1, py: 1 }}>{children}</Box>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashbord = () => {
  const { users, pages, loading, uniqueBowlingStyle, uniqueBattingStyle } = useSelector(
    (state) => state.allUsers
  );
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { keyword, bowlingStyle, battingStyle } = useParams();

  useEffect(() => {
    dispatch(allUserAction(page, keyword, bowlingStyle, battingStyle));
  }, [page, keyword, bowlingStyle, battingStyle]);

  // Derived KPI counts
  const totalPlayers = users ? users.length : 0;
  const activePlayers = users ? users.filter((u) => u.isActive !== false).length : 0;
  const rightHandedBatters = uniqueBattingStyle
    ? uniqueBattingStyle.filter((s) => /right/i.test(s)).length
    : 0;
  const rightHandedBowlers = uniqueBowlingStyle
    ? uniqueBowlingStyle.filter((s) => /right/i.test(s)).length
    : 0;

  return (
    <Box sx={{ bgcolor: COLORS.bg, minHeight: '100vh', pb: 6 }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.8 }}>
            <Box
              sx={{
                width: 4,
                height: 32,
                borderRadius: '2px',
                background: `linear-gradient(180deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%)`,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: COLORS.textPrimary,
                letterSpacing: '-0.02em',
                fontSize: { xs: '24px', md: '30px' },
              }}
            >
              Player Management
            </Typography>
          </Box>
          <Typography
            sx={{
              color: COLORS.textSecondary,
              fontSize: '14px',
              pl: '20px',
              letterSpacing: '0.02em',
            }}
          >
            Manage and monitor all registered players
          </Typography>
        </Box>

        {/* ── KPI Stat Cards ───────────────────────────────────────────────── */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2.5,
            mb: 5,
          }}
        >
          <StatCard label="Total Players" value={totalPlayers} icon="👥" />
          <StatCard label="Active Players" value={activePlayers} icon="✅" />
          <StatCard label="Batting: Right-handed" value={rightHandedBatters} icon="🏏" />
          <StatCard label="Bowling: Right-handed" value={rightHandedBowlers} icon="⚾" />
        </Box>

        {/* ── Two-Column Layout ─────────────────────────────────────────────── */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">

          {/* ── Left Column: Filters ─────────────────────────────────────── */}
          <Box sx={{ width: { xs: '100%', md: '220px' }, flexShrink: 0 }}>

            <FilterCard
              title="Bowling Style"
              icon={<SportsBaseballIcon sx={{ fontSize: 18 }} />}
            >
              <MenuList dense disablePadding>
                {uniqueBowlingStyle &&
                  uniqueBowlingStyle.map((style, i) => (
                    <MenuItem
                      key={i}
                      sx={{
                        borderRadius: '6px',
                        mb: 0.5,
                        px: 1.5,
                        py: 0.8,
                        '&:hover': {
                          background: 'rgba(201,162,39,0.12)',
                        },
                        '&:hover .filter-link': {
                          color: COLORS.gold,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: '28px' }}>
                        <SportsBaseballIcon sx={{ color: COLORS.gold, fontSize: 15 }} />
                      </ListItemIcon>
                      <Link
                        className="filter-link"
                        style={{
                          color: COLORS.textSecondary,
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: 500,
                          transition: 'color 0.15s ease',
                        }}
                        to={`/search/bowlingStyle/${style}`}
                      >
                        {style}
                      </Link>
                    </MenuItem>
                  ))}
              </MenuList>
            </FilterCard>

            <FilterCard
              title="Batting Style"
              icon={<SportsCricketIcon sx={{ fontSize: 18 }} />}
            >
              <MenuList dense disablePadding>
                {uniqueBattingStyle &&
                  uniqueBattingStyle.map((style, i) => (
                    <MenuItem
                      key={i}
                      sx={{
                        borderRadius: '6px',
                        mb: 0.5,
                        px: 1.5,
                        py: 0.8,
                        '&:hover': {
                          background: 'rgba(201,162,39,0.12)',
                        },
                        '&:hover .filter-link': {
                          color: COLORS.gold,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: '28px' }}>
                        <SportsCricketIcon sx={{ color: COLORS.gold, fontSize: 15 }} />
                      </ListItemIcon>
                      <Link
                        className="filter-link"
                        style={{
                          color: COLORS.textSecondary,
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: 500,
                          transition: 'color 0.15s ease',
                        }}
                        to={`/search/battingStyle/${style}`}
                      >
                        {style}
                      </Link>
                    </MenuItem>
                  ))}
              </MenuList>
            </FilterCard>

          </Box>

          {/* ── Right Column: Player List ─────────────────────────────────── */}
          <Box sx={{ flex: 1, minWidth: 0 }}>

            {/* Section sub-header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2.5,
                pb: 2,
                borderBottom: `1px solid ${COLORS.divider}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                  letterSpacing: '0.03em',
                }}
              >
                Player Roster
              </Typography>
              {users && users.length > 0 && (
                <Box
                  sx={{
                    background: 'rgba(201,162,39,0.15)',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '20px',
                    px: 1.5,
                    py: 0.4,
                  }}
                >
                  <Typography
                    sx={{ fontSize: '12px', fontWeight: 600, color: COLORS.gold }}
                  >
                    {users.length} player{users.length !== 1 ? 's' : ''} shown
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Player cards / loading / empty state */}
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '300px',
                }}
              >
                <LoadingBox />
              </Box>
            ) : users && users.length === 0 ? (
              <Box
                sx={{
                  minHeight: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: COLORS.card,
                  borderRadius: '10px',
                  border: `1px dashed ${COLORS.border}`,
                  gap: 1.5,
                }}
              >
                <Typography sx={{ fontSize: '36px', lineHeight: 1 }}>🏏</Typography>
                <Typography
                  sx={{ color: COLORS.textPrimary, fontWeight: 700, fontSize: '16px' }}
                >
                  No players found
                </Typography>
                <Typography sx={{ color: COLORS.textSecondary, fontSize: '13px' }}>
                  Try adjusting your filters or search term
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {users.map((user, i) => (
                  <Box
                    key={i}
                    sx={{
                      background: COLORS.card,
                      borderRadius: '10px',
                      border: `1px solid ${COLORS.border}`,
                      mb: 2,
                      overflow: 'hidden',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 22px rgba(0,0,0,0.4)',
                        borderColor: `rgba(201,162,39,0.55)`,
                      },
                    }}
                  >
                    <UserCardElement
                      id={user._id}
                      firstName={user.firstName}
                      email={user.email}
                      bowlingStyle={user.bowlingStyle}
                      battingStyle={user.battingStyle}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {/* Pagination */}
            {!loading && users && users.length > 0 && (
              <Box
                sx={{
                  mt: 3,
                  pt: 3,
                  borderTop: `1px solid ${COLORS.divider}`,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Pagination
                  color="primary"
                  variant="outlined"
                  page={page}
                  count={pages === 0 ? 1 : pages}
                  onChange={(event, value) => setPage(value)}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: COLORS.textSecondary,
                      borderColor: COLORS.divider,
                      '&:hover': {
                        background: 'rgba(201,162,39,0.12)',
                        borderColor: COLORS.gold,
                        color: COLORS.gold,
                      },
                      '&.Mui-selected': {
                        background: 'rgba(201,162,39,0.2)',
                        borderColor: COLORS.gold,
                        color: COLORS.gold,
                        fontWeight: 700,
                      },
                    },
                  }}
                />
              </Box>
            )}

          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default AdminDashbord;
