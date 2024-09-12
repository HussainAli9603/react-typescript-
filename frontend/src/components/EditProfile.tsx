import React,{ useEffect} from 'react'
import { Box, Paper, Avatar, Typography, TextField, Button } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {useNavigate, useParams  } from 'react-router-dom'

// Define your form input interface
interface IFormInput {
  fullName: string;
  username: string;
  email: string;
  phone: number;
}

const EditProfilePage = () => {
    const paperStyle = { padding: '30px 20px', width: 300, margin: "20px auto" }
    const headerStyle = { margin: 0 }
    const avatarStyle = { backgroundColor: '#1bbd7e', width: 60, height: 60, }

    // React Hook Form hooks
  const { register, handleSubmit, watch, formState: { errors }, reset  } = useForm<IFormInput>();

  const { email } = useParams();

  const navigate = useNavigate();

  // QueryClient from react-query to invalidate or refetch data
  const queryClient = useQueryClient();

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

useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, reset]);

  const { mutate, isError, error } = useMutation({
    mutationFn: async (formData: IFormInput) => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/edit-profile/${email}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) { throw new Error(data.error || "Something went wrong"); }
        return data;
      } catch (error) {
        console.error("Error during sign In:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
 
   // Form submit handler
   const onSubmit: SubmitHandler<IFormInput> = (data) => {
    mutate(data);
    navigate(`/profile/${data.email}`);
  };
    
    return (
        <Box onSubmit={handleSubmit(onSubmit)}>
            <Paper elevation={20} style={paperStyle}>
                <Box p={2} alignItems="center" >
                    <Avatar style={avatarStyle}>
                        <AddCircleOutlineOutlinedIcon />
                    </Avatar>
                    <h2 style={headerStyle}>Edit Profile</h2>
                    <Typography variant='caption' gutterBottom>Please fill this form to Edit an account !</Typography>
                    {isError && <p className='text-red-500'>{error.message}</p>}
                </Box>
                <form>
                    <TextField fullWidth 
                       required
                       id="name"
                       label="name"
                       autoComplete="name"
                       {...register("fullName", { required: true })}
                       placeholder='Enter your Name'
                    />
                    {errors.fullName && <p>{errors.fullName.message}</p>}
                    <TextField fullWidth 
                       required
                       id="username"
                       label="Username"
                       autoComplete="username"
                       {...register("username", { required: true })}
                    />
                     {errors.username && <p>User name is required.</p>}
                    
                    <TextField fullWidth 
                       required
                       id="email"
                       label="Email Address"
                       autoComplete="email"
                       placeholder="Enter your email" 
                       {...register("email", { required: true, pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ })}
                    
                    />
                     {errors.email && errors.email.type === "required" && <p>Email is required.</p>}
                     {errors.email && errors.email.type === "pattern" && <p>Invalid email address.</p>}

                    <TextField fullWidth 
                       label='Phone Number' 
                       placeholder="Enter your phone number" 
                       required
                       id="phone"
                       autoComplete="phone"
                       {...register("phone", { required: true })}
                    />
                    {errors.phone && <span>{errors.phone.message}</span>}

                    <Button type='submit' variant='contained' color='primary'>Edit</Button>
                </form>
                
            </Paper>
        </Box>
    )
}

export default EditProfilePage;
