import React, {useEffect} from 'react';
import { Box, Typography, Avatar, Paper, Grid, Button } from '@mui/material';
import { useParams } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { useQuery } from "@tanstack/react-query";

const Profile: React.FC = () => {

  // Styled components
const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const { email } = useParams();
  
  const {
    data: user,
    refetch,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/profile/${email}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        // Type assertion to handle 'unknown' type
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [email, refetch]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2,
      }}
    >
      <ProfilePaper elevation={3}>
        <AvatarContainer>
          <Avatar
            alt="User Profile"
            src="https://via.placeholder.com/150"
            sx={{ width: 100, height: 100 }}
          />
        </AvatarContainer>
        <Typography variant="h4" component="h1" gutterBottom>
          {user.fullName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {user.username}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
        {user.email}
        </Typography>
        <Typography variant="body2" color="textSecondary">
        {user.phone}
        </Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
          <Grid item>
            <Button variant="contained" color="primary">
              Edit Profile
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary">
              Logout
            </Button>
          </Grid>
        </Grid>
      </ProfilePaper>
    </Box>
  );
};


export default Profile;