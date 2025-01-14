import React, { useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Container, Grid, Typography, Paper, Divider, Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControlLabel, Checkbox } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';  // Make sure you have SweetAlert2 installed
import ModTheme from '../../ThemeComponent/ModTheme';
import ButtonComponent from '../../ReusableComponents/ButtonComponent/ButtonComponent';
import api from '../../../assets/baseURL/api';
import secureLocalStorage from 'react-secure-storage';
import secure from '../../../assets/baseURL/secure';
import MapViewModal from '../../ReusableComponents/ModalComponent/MapViewModal';
import PriceBreakdownModal from '../../ReusableComponents/ModalComponent/PriceBreakDownModal';

const MyProductDetails = () => {
    const { state } = useLocation();
    const { productUuid } = state;
    const [productsData, setProductsData] = useState(null);
    const [parsedUserData, setParsedUserData] = useState(null)
    const [userToken, setUserToken] = useState(null)
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [openMap, setOpenMap] = useState(false);
    const [openPriceBreakdownModal, setOpenPriceBreakdownModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [comment, setComment] = useState('');  // New state for comment
    const [loading, setLoading] = useState(false);  // Loading state for offers
    const storageKey = secure.storageKey;
    const storagePrefix = secure.storagePrefix;

    const loadProducts = useCallback(async () => {
        try {

            let dynamicApi;
            if (userToken) {

                dynamicApi = 'auth'

            } else {

                dynamicApi = 'global'

            }

            let query = `api/${dynamicApi}/items/${productUuid}`;

            if (userToken) {
                const res = await api.get(query, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (res.status === 200) {
                    console.log(res.data)
                    setProductsData(res.data);
                }
            } else {
                const res = await api.get(query);

                if (res.status === 200) {
                    console.log(parsedUserData)
                    console.log(res.data)
                    setProductsData(res.data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, [productUuid, userToken]);

    useEffect(() => {

        const storedIsLoggedIn = secureLocalStorage.getItem(`${storagePrefix}_isLoggedIn`, {
            hash: storageKey,
        });
        const storedUserData = secureLocalStorage.getItem(`${storagePrefix}_userData`, {
            hash: storageKey,
        });
        const storedUserToken = secureLocalStorage.getItem(`${storagePrefix}_userToken`, {
            hash: storageKey,
        });

        if (storedIsLoggedIn) {
            setIsLoggedIn(storedIsLoggedIn);
        } else {
            setIsLoggedIn(null);
        }

        if (storedUserData) {
            const objectUserData = JSON.parse(storedUserData)
            setParsedUserData(objectUserData);
        } else {
            setParsedUserData(null);
        }

        if (storedUserToken) {
            setUserToken(storedUserToken);
        } else {
            setUserToken(null);
        }

        loadProducts(storedUserToken);
    }, [loadProducts]);

    const handleMamoFeatureItem = async (uuid) => {

        try {
            const res = await api.post(`/api/auth/payment/mamopay/checkout/featured-product/${uuid}`, "", {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 200) {
                const mamopayUrl = res.data.data.payment_url
                window.location.href = mamopayUrl
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleOpenMap = (address) => {
        setSelectedAddress(address);
        setOpenMap(true);
    };

    const handleCloseMap = () => {
        setOpenMap(false);
        setSelectedAddress(null);
    };

    const dateParser = (dateInput) => {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const date = new Date(dateInput);

        // Extract values
        const month = months[date.getMonth()];
        const day = String(date.getDate()).padStart(2, '0'); // Ensures 2-digit day
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0'); // Ensures 2-digit hours
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensures 2-digit minutes

        // Format date as "Oct-dd-yyyy hh:mm"
        return `${month}-${day}-${year} ${hours}:${minutes}`;
    };

    const handleCommentSubmit = async () => {
        if (!parsedUserData && !isLoggedIn) {
            Swal.fire({
                title: 'Oops!',
                text: 'You need to login first before you can ask/answer questions.',
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: "Ok, I'll login.",
                confirmButtonColor: ModTheme.palette.primary.main,
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
        }


        if (!comment) {
            Swal.fire('Error', 'Please enter a comment', 'error');
            Swal.fire({
                title: 'Oops!',
                text: 'Please enter a comment',
                icon: 'error',
                confirmButtonText: "Ok",
                confirmButtonColor: ModTheme.palette.primary.main,
            })
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('item_id', productsData.item_details.id);
        formData.append('owner_id', productsData.item_details.user.id);
        formData.append('user_id', parsedUserData.id);
        formData.append('comments', comment);

        try {
            const res = await api.post("/api/auth/item-comment", formData, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {

                setComment('');  // Clear the input field after submission
                loadProducts()
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to submit comment', 'error');
        } finally {
            setLoading(false);
        }
    };

    const parseAddress = (address) => {
        const objectAddress = JSON.parse(address)
        // console.log(objectAddress)
        let addressName = ""

        if (objectAddress[1]) {
            addressName = objectAddress[1].name
        }
        return addressName.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleOpenPriceBreakdown = (product) => {
        setSelectedProduct(product);
        setOpenPriceBreakdownModal(true);
    };

    const handleClosePriceBreakdown = () => {
        setOpenPriceBreakdownModal(false);
        setSelectedProduct(null);
    }

    // Handle rendering after data is loaded
    if (!productsData || !productsData.item_details) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <ThemeProvider theme={ModTheme}>
            <Container
                sx={{
                    backgroundColor: 'secondary.background',
                    padding: 2,
                    mt: 15,
                    mb: 10,
                    boxShadow: 10,
                    maxWidth: { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' },
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Carousel showArrows={false} infiniteLoop={true} autoPlay>
                            {productsData.item_details.images.map((image, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '400px',
                                    }}
                                >
                                    <img
                                        src={image.image_url}
                                        style={{
                                            maxHeight: '100%',
                                            maxWidth: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </Box>
                            ))}
                        </Carousel>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            {productsData.item_details.item_name}
                        </Typography>
                        {
                            productsData.item_details.my_offer === null || productsData.item_details.my_offer === "" ? (
                                <Typography
                                    variant="body1"
                                    color="primary"
                                    onClick={() => handleOpenPriceBreakdown(productsData.item_details)}
                                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    AED {formatPrice(productsData.item_details.total_fee_breakdown.total)}
                                </Typography>
                            ) :
                                (
                                    <>
                                        <Typography component="div" color="primary" sx={{ textDecoration: 'line-through' }}>
                                            AED {formatPrice(productsData.item_details.total_fee_breakdown.total)}
                                        </Typography>
                                        <Typography component="div" color="primary">
                                            AED {formatPrice(productsData.item_details.my_offer.asking_price)}
                                        </Typography>
                                    </>
                                )
                        }
                        {
                            productsData.item_details.address && (
                                <Typography
                                    variant="body1"
                                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => handleOpenMap(productsData.item_details.address)}>
                                    Collection {parseAddress(productsData.item_details.address)}
                                </Typography>
                            )
                        }
                        <Typography variant="body1" color="textSecondary" paragraph>
                            {productsData.item_details.item_description}
                        </Typography>
                        <Grid container alignItems="center" spacing={2} width="100%">
                            <Grid item width="100%">
                                <ButtonComponent
                                    label="Feature Item"
                                    size="small"
                                    buttonVariant="contained"
                                    textColor="primary.contrastText"
                                    hoverTextColor="secondary.main"
                                    onClick={() => handleMamoFeatureItem(productUuid)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Paper sx={{ mt: 2, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Additional Information
                    </Typography>
                    <Divider />
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {productsData.item_property_details.map((info, index) => (
                                        <TableCell key={index}>
                                            <Typography variant="body1" fontWeight="bold">
                                                {info.properties}
                                            </Typography>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    {productsData.item_property_details.map((info, index) => (
                                        <TableCell key={index}>
                                            {info.values.length > 0
                                                ? info.values.map((value) => (
                                                    <Typography key={value.id}>{value.name}</Typography>
                                                ))
                                                : 'Not Available'}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <Paper sx={{ mt: 4, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Item questions and answers
                    </Typography>
                    <Divider />
                    <Box sx={{ mt: 2 }}>
                        {productsData.item_comments && productsData.item_comments.length > 0 ? (
                            productsData.item_comments.map((comment, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    {
                                        parsedUserData ? (
                                            <Typography variant="body1" fontWeight="bold">
                                                {
                                                    parsedUserData.id === comment.user.id ? 'You' : comment.user.id === productsData.item_details.user.id ? 'Item Owner' : comment.user.vendor.name}
                                            </Typography>
                                        ) : (
                                            <Typography variant="body1" fontWeight="bold">
                                                {comment.user.id === productsData.item_details.user.id ? 'Item Owner' : comment.user.vendor.name}
                                            </Typography>
                                        )

                                    }
                                    <Typography variant="body1">
                                        {comment.comments}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {dateParser(comment.created_at)}
                                    </Typography>
                                    <Divider sx={{ mt: 1 }} />
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No question available.
                            </Typography>
                        )}
                        {
                            parsedUserData ? (
                                <>
                                    <TextField
                                        label={parsedUserData.id === productsData.item_details.user.id ? 'Add an answer' : 'Add a question'}
                                        multiline
                                        rows={4}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ mt: 2 }}
                                    />
                                    <ButtonComponent
                                        label={parsedUserData.id === productsData.item_details.user.id ? 'Submit answer' : 'Submit question'}
                                        size="small"
                                        buttonVariant="contained"
                                        textColor="primary.contrastText"
                                        hoverTextColor="secondary.main"
                                        sx={{ mt: 1 }}
                                        onClick={handleCommentSubmit}
                                    />
                                </>
                            )
                                :
                                (
                                    <>
                                        <TextField
                                            label='Add a question'
                                            multiline
                                            rows={4}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                            sx={{ mt: 2 }}
                                        />
                                        <ButtonComponent
                                            label='Submit question'
                                            size="small"
                                            buttonVariant="contained"
                                            textColor="primary.contrastText"
                                            hoverTextColor="secondary.main"
                                            sx={{ mt: 1 }}
                                            onClick={handleCommentSubmit}
                                        />
                                    </>
                                )
                        }
                    </Box>
                </Paper>

                {selectedProduct && (
                    <PriceBreakdownModal
                        open={openPriceBreakdownModal}
                        onClose={handleClosePriceBreakdown}
                        product={selectedProduct}
                    />
                )}
                {selectedAddress && (
                    <MapViewModal
                        open={openMap}
                        onClose={handleCloseMap}
                        address={selectedAddress}
                    />
                )}
            </Container>
        </ThemeProvider>
    );
};

export default MyProductDetails;
