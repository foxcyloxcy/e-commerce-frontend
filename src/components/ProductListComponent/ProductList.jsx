import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Grid,
  FormControl,
  Input,
  InputAdornment,
  Checkbox,
  Slider,
  Button,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  Select,
  Tooltip,
  Divider,
  Pagination,
  Card,
  CardContent,
  Drawer,
  useMediaQuery
} from '@mui/material';
import { Search as SearchIcon, Menu as MenuIcon, ChevronLeft, ChevronRight, Star, StarBorder, FavoriteBorder } from '@mui/icons-material';
import ModTheme from '../ThemeComponent/ModTheme';

const categories = {
  Men: ['Shirts', 'Pants', 'Shoes'],
  Women: ['Dresses', 'Tops', 'Shoes'],
  Home: ['Furniture', 'Decor', 'Kitchen'],
  Pets: ['Food', 'Toys', 'Accessories'],
  'Baby & Children': ['Clothing', 'Toys', 'Furniture'],
};

const ProductList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery(ModTheme.breakpoints.down('md'));

  const handleMenuOpen = (event, category) => {
    setAnchorEl(event.currentTarget);
    setSubCategories(categories[category]);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerContent = (
    <div style={{ width: 250 }}>
      <Typography variant="h6" sx={{ padding: 2 }}>Filters</Typography>
            <Toolbar sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                background: ModTheme.palette.primary.main
            }}>
              {Object.keys(categories).map((category) => (
                <Button
                  key={category}
                  color="inherit"
                  onClick={(event) => handleMenuOpen(event, category)}
                >
                  {category}
                </Button>
              ))}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {subCategories.map((subCategory) => (
                  <MenuItem key={subCategory} onClick={handleMenuClose}>
                    {subCategory}
                  </MenuItem>
                ))}
              </Menu>
            </Toolbar>
      <Divider />
      <div style={{ padding: 16 }}>
        <FormControl fullWidth>
          <Input
            placeholder="Search"
            endAdornment={
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Divider sx={{ marginY: '20px' }} />
        <Typography variant="h6" component="h3" gutterBottom>
          Brands
        </Typography>
        <FormGroup>
          {['Mercedes', 'Toyota', 'Mitsubishi', 'Nissan', 'Honda'].map((brand) => (
            <FormControlLabel
              key={brand}
              control={<Checkbox />}
              label={
                <div>
                  {brand}
                  <Typography component="span" variant="body2" sx={{ float: 'right' }}>
                    {Math.floor(Math.random() * 100)}
                  </Typography>
                </div>
              }
            />
          ))}
        </FormGroup>
        <Divider sx={{ marginY: '20px' }} />
        <Typography variant="h6" component="h3" gutterBottom>
          Price range
        </Typography>
        <Slider defaultValue={50} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Input placeholder="$0" type="number" />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Input placeholder="$10000" type="number" />
            </FormControl>
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" fullWidth sx={{ marginTop: '10px' }}>
          Apply
        </Button>
        <Divider sx={{ marginY: '20px' }} />
        <Typography variant="h6" component="h3" gutterBottom>
          Sizes
        </Typography>
        <FormGroup row>
          {['XS', 'SM', 'LG', 'XXL'].map((size) => (
            <FormControlLabel
              key={size}
              control={<Checkbox />}
              label={<Button variant="outlined">{size}</Button>}
            />
          ))}
        </FormGroup>
        <Divider sx={{ marginY: '20px' }} />
        <Typography variant="h6" component="h3" gutterBottom>
          More filter
        </Typography>
        <RadioGroup defaultValue="any">
          {['Any condition', 'Brand new', 'Used items', 'Very old'].map((condition) => (
            <FormControlLabel key={condition} value={condition.toLowerCase()} control={<Radio />} label={condition} />
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  return (
    <div style={{ marginTop: 100 }}>
      <AppBar position="static">
        <Toolbar>
          {isSmallScreen && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Shop
          </Typography>
          {!isSmallScreen && Object.keys(categories).map((category) => (
            <Button
              key={category}
              color="inherit"
              onClick={(event) => handleMenuOpen(event, category)}
            >
              {category}
            </Button>
          ))}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {subCategories.map((subCategory) => (
              <MenuItem key={subCategory} onClick={handleMenuClose}>
                {subCategory}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        {drawerContent}
      </Drawer>
      <section style={{ padding: '20px 0' }}>
        <Container>
          <Grid container spacing={3}>
            {!isSmallScreen && (
              <Grid item xs={12} md={3} className='filter-grid'>
                {drawerContent}
              </Grid>
            )}
            <Grid item xs={12} md={9}>
              <header style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #e0e0e0' }}>
                <Grid container alignItems="center">
                  <Grid item xs={12} md>
                    <Typography variant="body1">32 Items found</Typography>
                  </Grid>
                  <Grid item>
                    <FormControl variant="outlined" sx={{ minWidth: 150, marginRight: '10px' }}>
                      <Select defaultValue="latest">
                        <MenuItem value="latest">Latest items</MenuItem>
                        <MenuItem value="trending">Trending</MenuItem>
                        <MenuItem value="popular">Most Popular</MenuItem>
                        <MenuItem value="cheapest">Cheapest</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <Tooltip title="List view">
                      <IconButton>
                        <ChevronLeft />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Grid view">
                      <IconButton>
                        <ChevronRight />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </header>
              {[1, 2, 3, 4].map((product) => (
                <Card key={product} sx={{ marginBottom: '20px' }}>
                  <Grid container spacing={0}>
                    <Grid item xs={12} md={3}>
                      <div style={{ position: 'relative' }}>
                        {product === 1 && <span className="badge badge-danger">NEW</span>}
                        <img src={`assets/images/items/${product}.jpg`} alt="Product" style={{ width: '100%' }} />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CardContent>
                        <Typography variant="h5">Great product name goes here</Typography>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                          <div style={{ display: 'flex' }}>
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} />
                            ))}
                            <StarBorder />
                          </div>
                          <Typography variant="body2" sx={{ marginLeft: '10px' }}>
                            7/10
                          </Typography>
                        </div>
                        <Typography variant="body2">
                          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
                          Ut wisi enim ad minim veniam
                        </Typography>
                      </CardContent>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <CardContent>
                        <Typography variant="h5">$140</Typography>
                        <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                          $198
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'green' }}>
                          Free shipping
                        </Typography>
                        <Button variant="contained" color="primary" fullWidth sx={{ marginTop: '10px' }}>
                          Details
                        </Button>
                        <Button variant="outlined" fullWidth startIcon={<FavoriteBorder />} sx={{ marginTop: '10px' }}>
                          Add to wishlist
                        </Button>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              ))}
              <Pagination count={3} color="primary" />
            </Grid>
          </Grid>
        </Container>
      </section>
    </div>
  );
};

export default ProductList;
