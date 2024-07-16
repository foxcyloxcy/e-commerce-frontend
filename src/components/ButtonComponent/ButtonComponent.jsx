import React from 'react';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import ModTheme from '../ThemeComponent/ModTheme';

export default function ButtonComponent(props) {
    const { label, height, width, textColor, hoverTextColor, buttonVariant, component, to, size, startIcon, position,
        bottom
     } = props;
     console.log(position)
     console.log(bottom)
    return (
        <ThemeProvider theme={ModTheme}>
            <Button
                bottom={bottom}
                position={position}
                component={component}
                to={to}
                fullWidth
                variant={buttonVariant}
                size={size}
                startIcon={startIcon}
                sx={{
                    mt: 2,
                    mb: 2,
                    color: textColor,
                    '&:hover': {
                        color: hoverTextColor,
                    },
                    height: height || 'auto',
                    width: width || '100%',
                    fontSize: '0.50rem',
                    '@media (min-width:400px)': {
                        fontSize: '0.5rem',
                    },
                    '@media (min-width:600px)': {
                        fontSize: '0.6rem',
                    },
                    '@media (min-width:960px)': {
                        fontSize: '0.8rem',
                    },
                    '@media (min-width:1280px)': {
                        fontSize: '0.9rem',
                    },
                }}
            >
                {label}
            </Button>
        </ThemeProvider>
    );
}
