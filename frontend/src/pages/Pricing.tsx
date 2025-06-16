// src/pages/Prices.tsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import Container   from '@mui/material/Container';
import Grid        from '@mui/material/Grid';
import Card        from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography  from '@mui/material/Typography';
import Button      from '@mui/material/Button';
import Box         from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Type definitions for each plan
type Plan = {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  featured?: boolean;
};

// Data for our plans
const plans: Plan[] = [
  {
    name: 'Individual',
    price: 0,
    period: '/month',
    description: 'Best option for personal use',
    features: [
      'Up to 5 video generations/week',
      '1,000,000 tokens for summarization /month',
      'Free new voice packs',
      'Up to 2 GB file storage',
    ],
    buttonText: 'Join the waitlist',
  },
  {
    name: 'Pro',
    price: 20,
    period: '/month',
    description: 'Best option for unlimited usage!',
    features: [
      'Unlimited video generations',
      'Unlimited summarization usage',
      'Request new voice packs',
      'Up to 50 GB file storage',
    ],
    buttonText: 'Join the waitlist',
    featured: true,
  },
];

export default function Prices() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',              // cover full viewport so no black gap
        py: 8,
        background: isLight
          ? 'linear-gradient(135deg, #2196f3 0%, #ffffff 100%)'
          : theme.palette.background.default,
        color: 'text.primary',
      }}
    >
      <Container maxWidth="lg">
        {/* Page Heading */}
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            color: isLight ? 'common.white' : 'text.primary',
          }}
        >
          Plans and Pricing
        </Typography>

        {/* Grid v2 container */}
        <Grid
          container
          spacing={4}
          alignItems="stretch"
          justifyContent="center"
        >
          {plans.map((plan) => (
            <Grid
              key={plan.name}
              size={{ xs: 12, sm: 10, md: 5 }}
              sx={{ display: 'flex' }}
            >
              <Card
                elevation={plan.featured ? 8 : 1}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box',
                  ...(plan.featured
                    ? {
                        border: '6px solid',
                        borderImage: isLight
                          ? 'linear-gradient(135deg, #ffffff 0%, #2196f3 100%) 1'
                          : 'linear-gradient(135deg, #7b1fa2 0%, #0d47a1 100%) 1',
                      }
                    : {
                        border: '1px solid',
                        borderColor: 'grey.300',
                      }),
                  boxShadow: plan.featured
                    ? '0 0 20px rgba(63,81,181,0.6)'
                    : 'none',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: plan.featured
                      ? '0 0 30px rgba(63,81,181,0.8)'
                      : '0 0 10px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      color={plan.featured ? 'primary.main' : 'text.primary'}
                    >
                      {plan.name}
                    </Typography>

                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="baseline"
                      mb={2}
                    >
                      <Typography variant="h4" component="span">
                        ${plan.price}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        component="span"
                        sx={{ ml: 1 }}
                      >
                        {plan.period}
                      </Typography>
                    </Box>

                    <Typography variant="body1" color="text.secondary" paragraph>
                      {plan.description}
                    </Typography>
                  </Box>

                  <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                    {plan.features.map((feat) => (
                      <Box
                        key={feat}
                        component="li"
                        display="flex"
                        alignItems="center"
                        mb={1}
                        sx={{ px: 2 }}
                      >
                        <CheckCircleIcon
                          fontSize="small"
                          sx={{
                            color: 'success.main',
                            mr: 1,
                            filter: 'drop-shadow(0 0 4px rgba(76, 175, 80, 0.8))',
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {feat}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    fullWidth
                    variant={plan.featured ? 'contained' : 'outlined'}
                    color={plan.featured ? 'primary' : 'inherit'}
                    sx={{
                      py: 2,
                      ...(plan.featured && {
                        backgroundImage: isLight
                          ? 'linear-gradient(270deg, #ffffff, #2196f3)'
                          : 'linear-gradient(270deg, #7b1fa2, #0d47a1)',
                        backgroundSize: '200% 100%',
                        animation: 'shine 4s ease infinite',
                        '@keyframes shine': {
                          '0%': { backgroundPosition: '0% 50%' },
                          '50%': { backgroundPosition: '100% 50%' },
                          '100%': { backgroundPosition: '0% 50%' },
                        },
                      }),
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
