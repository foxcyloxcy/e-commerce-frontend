import React from 'react';
import {
    Box,
    Typography,
    Button,
    Modal,
    Backdrop,
    Fade,
    Divider,
} from '@mui/material';

// Price breakdown modal component
// Price breakdown modal component
const PriceBreakdownModal = ({ open, onClose, product }) => {
    // Check if product exists before rendering the modal content
    if (!product) {
        return null;
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Price breakdown
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1">
                        Item: AED {product.price}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        Buyer Protection fee: AED {(product.total_fee - product.price).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                        Postage fees will be added at checkout.
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 2 }}>
                        Our Buyer Protection fee is mandatory when you purchase an item on the platform. It is added to every purchase made with the 'Buy Now' button. The item price is set by the seller and may be subject to negotiation.
                    </Typography>
                    <Button onClick={onClose} variant="contained" fullWidth sx={{ mt: 3 }}>
                        Ok, close
                    </Button>
                </Box>
            </Fade>
        </Modal>
    );
};


export default PriceBreakdownModal;