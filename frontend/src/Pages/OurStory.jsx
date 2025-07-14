import React from 'react';
import { Grid, Typography, Card, CardContent, Box } from '@mui/material';

const features = [
  {
    title: 'Excellent Quality',
    desc: 'Lorem ipsum dolor sit amet, consectetur elit.',
  },
  {
    title: 'Trust & Integrity',
    desc: 'Lorem ipsum dolor sit amet, consectetur elit.',
  },
  {
    title: 'Ongoing R & D',
    desc: 'Lorem ipsum dolor sit amet, consectetur elit.',
  },
  {
    title: 'Smart Support',
    desc: 'Lorem ipsum dolor sit amet, consectetur elit.',
  },
];

const images = [
  require('../assets/story1.jpg'),
  require('../assets/story2.jpg'),
  require('../assets/story3.jpg'),
  require('../assets/story4.jpg'),
];

const OurStory = () => {
  return (
    <Box sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 8 }, background: '#fff' }}>
      <Grid container spacing={4} alignItems="center">
        {/* Left Side: Text and Features */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Our Story
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </Typography>
          <Grid container spacing={2}>
            {features.map((feature, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Card elevation={0} sx={{ border: '1px solid #eee', borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {/* Right Side: 2x2 Image Grid */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {images.map((img, idx) => (
              <Grid item xs={6} key={idx}>
                <Box
                  component="img"
                  src={img}
                  alt={`story${idx + 1}`}
                  sx={{
                    width: '100%',
                    height: { xs: 120, sm: 140, md: 160 },
                    objectFit: 'cover',
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OurStory;