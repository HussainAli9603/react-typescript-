import React,{useState} from 'react'
import { Box, Paper, Avatar, Typography, TextField, Button } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate  } from 'react-router-dom'

// Define your form input interface
interface IFormInput {
  fullName: string;
  username: string;
  email: string;
  phone: number;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
    const paperStyle = { padding: '30px 20px', width: 300, margin: "20px auto" }
    const headerStyle = { margin: 0 }
    const avatarStyle = { backgroundColor: '#1bbd7e', width: 60, height: 60, }

    const [formData, setFormData] = useState<IFormInput>({
      fullName: "",
      username: "",
      email: "",
      phone:0,
      password: "",
      confirmPassword: ""
    });

    // React Hook Form hooks
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IFormInput>();

  // Watch password field for validation
  const password = watch("password");

  // QueryClient from react-query to invalidate or refetch data
  const queryClient = useQueryClient();

  const navigate = useNavigate();

   // Mutation to handle form submission
   const { mutate, isError, error } = useMutation({
    mutationFn: async (formData: IFormInput) => {
      try {
        const res = await fetch(" http://localhost:5000/api/v1/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");
        return data;
      } catch (error) {
        console.error("Error during sign up:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate or refetch query to update the user state
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      navigate("/login");
    },
  });
 
   // Form submit handler
   const onSubmit: SubmitHandler<IFormInput> = (data) => {
    mutate(data); // Pass the form data to mutate
  };
    
    return (
        <Box  onSubmit={handleSubmit(onSubmit)}>
            <Paper elevation={20} style={paperStyle}>
                <Box p={2} alignItems="center" >
                    <Avatar style={avatarStyle}>
                        <AddCircleOutlineOutlinedIcon />
                    </Avatar>
                    <h2 style={headerStyle}>Sign In</h2>
                    <Typography variant='caption' gutterBottom>Please fill this form to create an account !</Typography>
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


                    <TextField fullWidth 
                       label='Password' 
                       placeholder="Enter your password"
                       required
                       id="password"
                       autoComplete="password"
                       type='password'
                       {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters long"
                        }
                      })}
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                    
                    <TextField fullWidth 
                       label='Confirm Password' 
                       placeholder="Confirm your password"
                       required
                       type='password'
                       id="confirmPassword"
                       autoComplete="confirmPassword"
                       {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value:string) =>
                          value === password || "Passwords do not match"
                      })}
                    />
                     {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
                    <Button type='submit' variant='contained' color='primary'>Sign up</Button>
                </form>
                <div className='flex flex-col gap-2 mt-4'>
					        <span className='text-white'> Already have an account?</span><Link to='/login'> SignIn </Link>
				        </div>
            </Paper>
        </Box>
    )
}

export default RegisterPage;
