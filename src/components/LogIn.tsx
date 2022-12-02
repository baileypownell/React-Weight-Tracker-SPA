import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SendIcon from '@mui/icons-material/Send'
import { Box, Button, Divider, Snackbar, TextField, Typography } from '@mui/material'
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import * as actions from '../store/actionCreators'

const LogIn = (props) => {
  const [authError, setAuthError] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const navigate = useNavigate()
  const auth = getAuth()

  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Enter a valid email.')
      .required('Email is required.'),
    password: yup
      .string()
      .required('Password is required.')
  })

  const handleSubmit = async (values: { email: string, password: string}) => {
    try {
      const signinResponse = await signInWithEmailAndPassword(auth, values.email, values.password)
      const email = signinResponse.user.email;
      const uid = signinResponse.user.uid;
      props.login(email, uid);
      props.getUserData(uid);
      navigate('/dashboard');
    } catch(error) {
      setAuthError(true)
      setSnackBarMessage('There was an error.')
      console.log(`Error: ${error}`)
    }
  }

  const sendEmail = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      setSnackBarMessage('Password reset email sent.')
    } catch(error) {
      setSnackBarMessage('There was an error.')
      console.log(`Error: ${error}`)
    }
  }

  return (
    <Box 
      boxShadow={10}
      borderRadius={1} 
      padding={3}
      sx={{ backgroundColor: 'grey.main' }}>
      <Typography variant="h6">Log In</Typography>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
        render={formik => (
          <>
            <Form>
              <TextField
                variant="standard" 
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                onBlur={formik.handleBlur}
                type="email"
                id="email"
                name="email"/>
              <TextField
                variant="standard" 
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                onBlur={formik.handleBlur}
                type="password"
                label="Password"
                id="password"
                name="password"/>
              <Button 
                disabled={!formik.values.email || !formik.values.password} 
                color="primary"
                type="submit"
                variant="contained"
                sx={{
                  marginTop: '10px'
                }}>
                  Log In
              </Button>
            </Form>

            {authError ? 
              <Box padding={'1 0'}>
                <Typography marginBottom={1} >Forgot password? Receive a link to reset your password.</Typography>
                  <Button 
                    variant="outlined"
                    onClick={() => sendEmail(formik.values.email)}>
                    Send link 
                    <SendIcon sx={{ marginLeft: 1 }} />
                  </Button>
                </Box>
                : null
              }
              <Divider sx={{ margin: '20px 0' }} />
              <Box textAlign='right' paddingTop={1}>
                <Typography variant='h6'>Don't have an account?</Typography>
                <Button  
                  onClick={() => navigate('/signup')} 
                  variant="outlined"
                  color="secondary"
                  sx={{
                    marginTop: '10px'
                  }}>
                  Sign Up 
                  <ArrowForwardIcon sx={{ marginLeft: 1 }} />
                </Button>
              </Box>
          </>
        )}>
      </Formik>

      <Snackbar
        open={!!snackBarMessage.length}
        autoHideDuration={6000}
        onClose={() => setSnackBarMessage('')}
        message={snackBarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (email: string, uid: string) => dispatch(actions.loginUser(email, uid)),
    getUserData: (uid: string) => dispatch(actions.getUserDataAsync(uid))
  }
}

export default connect(null, mapDispatchToProps)(LogIn);
