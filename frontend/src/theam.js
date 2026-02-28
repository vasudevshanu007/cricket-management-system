import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#C9A227',
            light: '#E8C547',
            dark: '#A07D1C',
            contrastText: '#0D1B2A',
        },
        secondary: {
            main: '#1E3A5F',
            light: '#2E5182',
            dark: '#0D1B2A',
            contrastText: '#FFFFFF',
            midNightBlue: "#0D1B2A",
        },
        background: {
            default: '#0D1B2A',
            paper: '#1B2A4A',
        },
        text: {
            primary: '#F5F7FA',
            secondary: '#A0B0C8',
        },
        success: { main: '#4CAF50' },
        warning: { main: '#FF9800' },
        error: { main: '#F44336' },
        info: { main: '#00BCD4' },
        divider: 'rgba(201, 162, 39, 0.2)',
    },
    typography: {
        fontFamily: "'Poppins', 'Inter', sans-serif",
        h1: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, letterSpacing: '-0.02em' },
        h2: { fontFamily: "'Poppins', sans-serif", fontWeight: 700, letterSpacing: '-0.01em' },
        h3: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
        h4: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
        h5: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
        h6: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
        button: { fontFamily: "'Poppins', sans-serif", fontWeight: 600, textTransform: 'none' },
        body1: { fontFamily: "'Inter', 'Poppins', sans-serif", lineHeight: 1.7 },
        body2: { fontFamily: "'Inter', 'Poppins', sans-serif", lineHeight: 1.6 },
    },
    shape: { borderRadius: 10 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px', padding: '10px 24px', fontWeight: 600,
                    boxShadow: 'none', transition: 'all 0.2s ease',
                    '&:hover': { boxShadow: '0 4px 20px rgba(201,162,39,0.35)', transform: 'translateY(-1px)' },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #C9A227 0%, #E8C547 100%)',
                    color: '#0D1B2A',
                    '&:hover': { background: 'linear-gradient(135deg, #A07D1C 0%, #C9A227 100%)' },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', backgroundColor: '#1B2A4A',
                    border: '1px solid rgba(201,162,39,0.1)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)', borderRadius: '12px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(201,162,39,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(201,162,39,0.6)' },
                        '&.Mui-focused fieldset': { borderColor: '#C9A227' },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#A0B0C8',
                        '&.Mui-focused': { color: '#C9A227' },
                    },
                    '& .MuiOutlinedInput-input': { color: '#F5F7FA' },
                    '& .MuiInputBase-input': { color: '#F5F7FA' },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    color: '#F5F7FA',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(201,162,39,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(201,162,39,0.6)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C9A227' },
                },
                icon: { color: '#A0B0C8' },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: 'none', backgroundColor: '#1B2A4A' },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#1B2A4A',
                    border: '1px solid rgba(201,162,39,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    color: '#F5F7FA',
                    '&:hover': { backgroundColor: 'rgba(201,162,39,0.1)' },
                    '&.Mui-selected': { backgroundColor: 'rgba(201,162,39,0.15)', color: '#C9A227' },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: { color: '#A0B0C8', '&.Mui-focused': { color: '#C9A227' } },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: 'rgba(201,162,39,0.5)',
                    '&.Mui-checked': { color: '#C9A227' },
                },
            },
        },
        MuiPagination: {
            styleOverrides: {
                root: {
                    '& .MuiPaginationItem-root': {
                        color: '#A0B0C8', borderColor: 'rgba(201,162,39,0.2)',
                        '&.Mui-selected': { backgroundColor: '#C9A227', color: '#0D1B2A', borderColor: '#C9A227' },
                        '&:hover': { backgroundColor: 'rgba(201,162,39,0.1)' },
                    },
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 'none', backgroundColor: '#1B2A4A', color: '#F5F7FA',
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#0D1B2A', color: '#C9A227',
                        borderBottom: '1px solid rgba(201,162,39,0.2)',
                    },
                    '& .MuiDataGrid-row': { '&:hover': { backgroundColor: 'rgba(201,162,39,0.05)' } },
                    '& .MuiDataGrid-cell': { borderColor: 'rgba(255,255,255,0.05)' },
                    '& .MuiDataGrid-footerContainer': {
                        backgroundColor: '#0D1B2A', borderTop: '1px solid rgba(201,162,39,0.2)',
                    },
                },
            },
        },
    },
});
