import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded'
import { Box, Button, Snackbar, Stack, TextField, Typography, useTheme } from '@mui/material'
import { useWindowWidth } from '@react-hook/window-size'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import firebase from '../firebase-config'
import * as actions from '../store/actionCreators'

const CreateAccount = (props) => {
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const navigate = useNavigate();
  const theme = useTheme();
  const width = useWindowWidth();

  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Enter a valid email.')
      .required('Email is required.'),
    firstName: yup
      .string()
      .required('First name is required.'),
    lastName: yup
      .string()
      .required('Last name is required.'),
    password: yup
      .string()
      .required('Password is required.')
  })

  const handleSubmit = async (values: {firstName: string, lastName: string, email: string, password: string}): Promise<void> => {
    const { firstName, lastName } = values;
    try {
      const userCreationResponse = await createUserWithEmailAndPassword(getAuth(), values.email, values.password)
      const email = userCreationResponse.user.email;
      const uid = userCreationResponse.user.uid;

      const db = getFirestore(firebase);
      await setDoc(doc(db, 'users', uid), {
        firstName,
        lastName,
        email,
        firebaseAuthID: uid,
        weights: [],
        goals: []
      });

      props.createAccount(firstName, lastName, email, uid);
      navigate('/dashboard');
    } catch(error) {
      console.log(`Error: ${error}`)
      setSnackBarMessage('There was an error.')
    }
   }

  return (
    <Box
      boxShadow={10}
      padding={3}
      sx={{ 
        backgroundColor: 'gray.main',
        minWidth: '100%',
        [theme.breakpoints.up('sm')]: {
          minWidth: 500,
          borderRadius: 1,
        },
      }}>
      <Typography variant='h6' marginBottom={2}>Create an Account</Typography>
      <Formik
        initialValues={{
          email: '',
          firstName: '',
          lastName: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
        render={formik => (
          <Form>
            <Box sx={{ textAlign: 'right' }}>
              <Stack spacing={2}>
                <Stack spacing={2} direction={width > 700 ? "row" : "column"} >
                  <TextField
                    variant="filled" 
                    label="First name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    onBlur={formik.handleBlur}
                    sx={{ flexGrow: '1' }}
                    type="text"
                    id="firstName"
                    name="firstName"/>
                  <TextField
                    variant="filled" 
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    sx={{ flexGrow: '1' }}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    onBlur={formik.handleBlur}
                    type="text"
                    label="Last name"
                    id="lastName"
                    name="lastName"/>
                </Stack>
                <Stack spacing={2} direction={width > 700 ? "row" : "column"} >
                  <TextField
                    variant="filled" 
                    label="Email"
                    sx={{ flexGrow: '1' }}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    onBlur={formik.handleBlur}
                    type="email"
                    id="email"
                    name="email"/>
                  <TextField
                    variant="filled" 
                    sx={{ flexGrow: '1' }}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    onBlur={formik.handleBlur}
                    type="password"
                    label="Password"
                    id="password"
                    name="password"/>
                </Stack>
              </Stack>
              <Button 
                disabled={!formik.values.firstName || !formik.values.lastName || !formik.values.email || !formik.values.password}
                variant="contained"
                type="submit"
                color="secondary"
                sx={{
                  width: width < 700 ? '100%' : 'auto',
                  marginTop: 3
                }}>
                  <AddBoxRoundedIcon sx={{ marginRight: 1 }}></AddBoxRoundedIcon>
                  Sign Up
              </Button>
            </Box>
          </Form>
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

const mapStateToProps = state => {
  return {
    userLoggedIn: state.userLoggedIn
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createAccount: (firstName: string, lastName: string, email: string, uid: string) => dispatch(actions.createAccount(firstName, lastName, email, uid)),
    logout: () => dispatch(actions.logoutUser())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);
