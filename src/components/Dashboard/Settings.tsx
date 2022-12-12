import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { deleteUser, getAuth, sendPasswordResetEmail, updateEmail } from 'firebase/auth';
import { deleteDoc, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import firebase from '../../firebase-config';
import * as actions from '../../store/actionCreators';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const db = getFirestore(firebase);

const Settings = (props) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any | null>(null)
  const [showUserConfirmationModal, setShowUserConfirmationModal] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')

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

  useEffect(() => {
    getUserData()
  }, []);

  const getUserData = async () => {
    const docRef = doc(db, 'users', props.uid);
    try {
      const docSnap = await getDoc(docRef);
      setUser(docSnap.data())
    } catch(error) {
      console.log(error)
    }
  }

  const deleteAccount = async () => {
    const uid = props.uid;
    // does not delete user data; need to update to delete collections :(
    try {
      await Promise.all([
        deleteDoc(doc(db, 'users', uid)),
        deleteUser(getAuth().currentUser!)
      ]);
      props.deleteUser()
      setSnackBarMessage('Account successfully deleted.')
      props.logoutUser();
      navigate('/')
    } catch(error) {
      console.log(`Error: ${error}`)
      setSnackBarMessage('There was an error deleting the user.')
    }
  }

  const handleEmailUpdate = async (values) => {
    try {
      const userRef = doc(db, 'users', props.uid);
      await Promise.all([
        updateEmail(getAuth().currentUser!, values.email),
        setDoc(userRef, {
          email: values.email
        }, { merge: true })
      ])

      setSnackBarMessage('User email updated.')
      props.changeEmail(values.email)
    } catch(error) {
      console.log(`Error: ${error}`)
      setSnackBarMessage('User email could not be updated.')
    }
  }

  const handleNameSubmission = (values) => {
    try {
      const userRef = doc(db, 'users', props.uid);
      setDoc(userRef, { 
        firstName: values.firstName, 
        lastName: values.lastName 
      }, { merge: true });

      setSnackBarMessage('Name updated.')
    } catch (error) {
      console.log(`Error: ${error}`)
      setSnackBarMessage('There was an error.')
    }
  }

  const changePassword = async () => {
    try {
      await sendPasswordResetEmail(getAuth(), user.email)
      setSnackBarMessage('Password reset email sent.')
    } catch(error) {
      console.log(`Error: ${error}`)
      setSnackBarMessage('There was an error.')
    }
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Dialog open={showUserConfirmationModal}>
          <DialogTitle>Confirm Account Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete your account? This action is irreversible.
              </DialogContentText>
            </DialogContent>
          <DialogActions>
          <Button
            variant="contained" 
            autoFocus
            color="primary"
            onClick={() => setShowUserConfirmationModal(false)}>
              Cancel
          </Button>
          <Button 
            variant="outlined"  
            color="warning"
            onClick={deleteAccount}>
            <WarningAmberRoundedIcon sx={{
              marginRight: 1
            }}></WarningAmberRoundedIcon>Yes, delete my account
          </Button>
          </DialogActions>
      </Dialog>
      <Box maxWidth={'500px'} boxShadow={10}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} >
            <Typography>Update Name</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Formik
              initialValues={{
                firstName: user.firstName,
                lastName: user.lastName,
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => handleNameSubmission(values)}
              render={formik => (
                <Form>
                  <Stack spacing={3}>
                    <TextField
                      variant="filled" 
                      label="First name"
                      className="subvariant-dark"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                      helperText={(formik.touched.firstName && formik.errors.firstName) as boolean}
                      onBlur={formik.handleBlur}
                      type="text"
                      id="firstName"
                      name="firstName"/>
                    <TextField
                      variant="filled" 
                      className="subvariant-dark"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                      helperText={(formik.touched.lastName && formik.errors.lastName) as boolean}
                      onBlur={formik.handleBlur}
                      type="text"
                      label="Last name"
                      id="lastName"
                      name="lastName"/>
                  </Stack>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                    onClick={() => handleNameSubmission(formik.values)}
                    disabled={!formik.values.firstName || !formik.values.lastName}
                    sx={{ marginTop: 2 }}>
                    Update
                  </Button>
               </Form>
              )}>
            </Formik>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Update Email</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Formik
              initialValues={{
                email: user.email,
              }}
              validationSchema={validationSchema}
              onSubmit={handleEmailUpdate}
              render={formik => (
                <Form>
                  <Stack spacing={3}>
                    <TextField
                      variant="filled" 
                      className="subvariant-dark"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      onBlur={formik.handleBlur}
                      type="email"
                      label="Email"
                      id="email"
                      name="email"/>
                  </Stack>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={Boolean(formik.errors.email)}
                    sx={{ marginTop: 2 }}
                    onClick={() => handleEmailUpdate(formik.values)}
                    >
                    Update
                  </Button>
               </Form>
              )}>
            </Formik>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
          <Typography>Update Password</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <>
              <Typography variant="body1">Click the button below to receive an email with a link to reset your password. You may need to check your Spam folder.</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={changePassword} 
                sx={{ marginTop: 2 }}>
                  Email my link
              </Button>
            </>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
          <Typography>Delete Account</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <>
                <Typography variant="body1">This action cannot be undone.</Typography>
                <Button 
                  variant="outlined"
                  color="warning"
                  onClick={() => setShowUserConfirmationModal(true)}
                  sx={{ marginTop: 2 }}
                  >
                  Delete Account
                </Button>
            </>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Snackbar
        open={!!snackBarMessage.length}
        autoHideDuration={6000}
        onClose={() => setSnackBarMessage('')}
        message={snackBarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  )
}

const mapStateToProps = state => {
  return {
    idToken: state.idToken,
    uid: state.uid,
    email: state.user.email,
    lastName: state.user.lastName, 
    firstName: state.user.firstName
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteUser: () => dispatch(actions.deleteUser()),
    logoutUser: () => dispatch(actions.logoutUserAsync()),
    changeEmail: (email) => dispatch(actions.changeEmail(email)),
    changeFirstName: (firstName) => dispatch(actions.changeFirstName(firstName)),
    changeLastName: (lastName) => dispatch(actions.changeLastName(lastName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);