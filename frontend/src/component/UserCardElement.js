import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';

const UserCardElement = ({ firstName, email, phoneNumber, bowlingStyle, battingStyle, id }) => {
    return (
        <Box
            sx={{
                backgroundColor: '#1B2A4A',
                border: '1px solid rgba(201,162,39,0.1)',
                borderRadius: '12px',
                padding: '20px 24px',
                mb: 2,
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'default',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateX(4px)',
                    borderColor: 'rgba(201,162,39,0.7)',
                    boxShadow: '0 4px 24px rgba(201,162,39,0.15)',
                },
            }}
        >
            {/* Avatar */}
            <Box
                sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C9A227 0%, #F0C040 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                <Typography
                    sx={{
                        color: '#1B2A4A',
                        fontWeight: 700,
                        fontSize: '1.4rem',
                        lineHeight: 1,
                        textTransform: 'uppercase',
                    }}
                >
                    {firstName ? firstName.charAt(0) : '?'}
                </Typography>
            </Box>

            {/* Player Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="h6"
                    sx={{
                        color: '#F5F7FA',
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        mb: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {firstName}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {battingStyle && (
                        <Chip
                            icon={
                                <SportsCricketIcon
                                    sx={{ color: '#C9A227 !important', fontSize: '1rem' }}
                                />
                            }
                            label={battingStyle}
                            size="small"
                            sx={{
                                backgroundColor: 'rgba(201,162,39,0.1)',
                                color: '#F5F7FA',
                                fontSize: '0.72rem',
                                fontWeight: 500,
                                border: '1px solid rgba(201,162,39,0.25)',
                                '& .MuiChip-icon': { color: '#C9A227' },
                            }}
                        />
                    )}
                    {bowlingStyle && (
                        <Chip
                            icon={
                                <SportsBaseballIcon
                                    sx={{ color: '#2ABFBF !important', fontSize: '1rem' }}
                                />
                            }
                            label={bowlingStyle}
                            size="small"
                            sx={{
                                backgroundColor: 'rgba(42,191,191,0.1)',
                                color: '#F5F7FA',
                                fontSize: '0.72rem',
                                fontWeight: 500,
                                border: '1px solid rgba(42,191,191,0.25)',
                                '& .MuiChip-icon': { color: '#2ABFBF' },
                            }}
                        />
                    )}
                </Box>
            </Box>

            {/* View Button */}
            <Box sx={{ flexShrink: 0 }}>
                <Button
                    component={Link}
                    to={`/user/${id}`}
                    variant="outlined"
                    size="small"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />}
                    sx={{
                        color: '#C9A227',
                        borderColor: 'rgba(201,162,39,0.5)',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        textTransform: 'none',
                        borderRadius: '8px',
                        px: 2,
                        '&:hover': {
                            backgroundColor: 'rgba(201,162,39,0.1)',
                            borderColor: '#C9A227',
                        },
                    }}
                >
                    View
                </Button>
            </Box>
        </Box>
    );
};

export default UserCardElement;
