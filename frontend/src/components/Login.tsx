import React,{useState} from 'react'
import { Box, Paper, Avatar, Typography, TextField, Button } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from 'react-router-dom'

// form inputs structure using TypeScript interfaces
interface IFormInput {
    email: string;
    password: string;
}


const Login = () => {
    const paperStyle = { padding: '30px 20px', width: 300, margin: "20px auto" }
    const headerStyle = { margin: 0 }
    
    const { register, handleSubmit,watch, formState: { errors } } = useForm<IFormInput>();

    const password = watch("password");

    const queryClient = useQueryClient();

    const navigate = useNavigate();

     // Mutation to handle form submission
   const { mutate, isError, error } = useMutation({
    mutationFn: async (formData: IFormInput) => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) { throw new Error(data.error || "Something went wrong"); }
        navigate(`/profile/${data?.user?.email}`);
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
  };
     
    
    return (
        <Box onSubmit={handleSubmit(onSubmit)}>
            <Paper elevation={20} style={paperStyle}>
                <Box p={2} alignItems="center" >
                    <h2 style={headerStyle}>Sign In</h2>
                    <Typography variant='caption' gutterBottom>Please fill this form to Login an account !</Typography>
                </Box>
                <form>
                    
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
                       label='Password' 
                       placeholder="Enter your password"
                       required
                       id="password"
                       type='password'
                       autoComplete="password"
                       {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters long"
                        }
                      })}
                    />
                    {isError && <p className='text-red-500'>{error.message}</p>}
                    
                    <Button type='submit' variant='contained' color='primary'>Sign In</Button>
                </form>
                <div className='flex flex-col gap-2 mt-4'>
					<span className='text-white'>{"Don't"} have an account?</span><Link to='/register'> Sign up </Link>
				</div>
            </Paper>
        </Box>
    )
}

export default Login;

