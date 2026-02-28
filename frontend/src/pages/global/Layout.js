import React from 'react';
import { Box } from '@mui/material';
import HeaderTop from './HeaderTop';
import SidebarAdm from './Sidebar';

const COLORS = {
    navyBg: '#0D1B2A',
    navyDark: '#0A1628',
    border: 'rgba(201,162,39,0.08)',
};

/**
 * Layout HOC - wraps any page component with the professional
 * CricINDIA sidebar + header shell.
 *
 * Usage (in App.js):
 *   const MyPageHOC = Layout(MyPage);
 */
const Layout = (Component) => ({ ...props }) => {
    return (
        <>
            <style>{`
                .layout-content-area {
                    background-color: ${COLORS.navyBg};
                    background-image:
                        radial-gradient(
                            circle,
                            rgba(201,162,39,0.04) 1px,
                            transparent 1px
                        );
                    background-size: 28px 28px;
                    min-height: 100vh;
                }
            `}</style>
            <div
                style={{
                    display: 'flex',
                    minHeight: '100vh',
                    backgroundColor: COLORS.navyDark,
                }}
            >
                {/* Left: Sidebar */}
                <SidebarAdm />

                {/* Right: Header + Content */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        minWidth: 0,
                        backgroundColor: COLORS.navyBg,
                    }}
                >
                    {/* Top Header Bar */}
                    <HeaderTop />

                    {/* Main Content */}
                    <Box
                        className="layout-content-area"
                        sx={{
                            flex: 1,
                            p: 3,
                            overflowY: 'auto',
                        }}
                    >
                        <Component {...props} />
                    </Box>
                </Box>
            </div>
        </>
    );
};

export default Layout;
