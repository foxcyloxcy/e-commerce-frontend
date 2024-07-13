import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ModTheme from '../ThemeComponent/ModTheme';

function Copyright(props) {
    return (
        <Typography variant="body2" color="secondary.contrastText" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Reloved
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const Footer = () => {
    return (
        <ThemeProvider theme={ModTheme}>
            <Box
                sx={{
                    backgroundColor: 'secondary.main',
                    color: 'secondary.contrastText',
                    py: 3,
                    mt: 'auto',
                    borderTop: `1px solid ${ModTheme.palette.primary.light}`,
                }}
            >
                <Container>
                    <Grid container spacing={2} textAlign="left">
                        <Grid item xs={12} sm={6} md={3}>
                            <Box component="img" src="pre-amada-white.png" alt="Reloved Icon" sx={{ width: '100%', maxWidth: 150,}} />
                            <br />
                            The UAE's easiest marketplace for pre-loved items.
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6">Quick Links</Typography>
                            <Link href="#" color="inherit" underline="hover" variant="body2">Home</Link><br />
                            <Link href="#" color="inherit" underline="hover" variant="body2">Services</Link><br />
                            <Link href="#" color="inherit" underline="hover" variant="body2">Contact</Link>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6">Follow Us</Typography>
                            <Link href="#" color="inherit" underline="hover" variant="body2">Facebook</Link><br />
                            <Link href="#" color="inherit" underline="hover" variant="body2">Twitter</Link><br />
                            <Link href="#" color="inherit" underline="hover" variant="body2">Instagram</Link>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6">Policies</Typography>
                            <Link href="#" color="inherit" underline="hover" variant="body2">Terms and conditions</Link><br />
                            <Link href="#" color="inherit" underline="hover" variant="body2">Return/Refund</Link><br />
                            <Link href="#" color="inherit" underline="hover" variant="body2">Privacy</Link>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <Box
                sx={{
                    backgroundColor: 'primary.main',
                    color: 'secondary.contrastText',
                    py: 1,
                }}
            >
                <Container>
                    <Copyright sx={{ mt: 1, mb: 1 }} />
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default Footer;