import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { Form, Formik } from 'formik'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { connect } from 'react-redux'
import * as yup from 'yup'
import firebase from '../../firebase-config'

export const WeightLogger = (props) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');

  const validationSchema = yup.object({
    todaysWeight: yup
      .number()
      .integer()
      .typeError('Weight must be a number.')
      .min(1, 'Weight must be greater than 0 lbs.')
      .positive('Weight must be greater than 0 lbs.')
      .max(2000, 'Weight cannot exceed 2000 lbs.')
  })

  const logWeight = async (values) => {
    const db = getFirestore(firebase);
    let date = Date.now();
    let updatedWeights = props.weights.concat({
      date,
      weight: Number(values.todaysWeight)
    });
    const userRef = doc(db, 'users', props.uid);
    
    try {
      await setDoc(userRef, { weights: updatedWeights }, { merge: true })
      props.updateWeightHistory()
    } catch(error) {
      console.log(`Error: ${error}`)
      setSnackBarMessage('There was an error.')
    }
  } 
  
  const updateTodaysWeight = (values) => {
    let allWeights = props.weights
    let recordToUpdate = allWeights[0]
    recordToUpdate.weight = Number(values.todaysWeight)
    const db = getFirestore(firebase);
    const userRef = doc(db, 'users', props.uid);
    setDoc(userRef, { weights: allWeights }, { merge: true })
    setSnackBarMessage('Weight updated.')
    props.updateWeightHistory()
    setEditModalOpen(false)
  }

  const triggerEditModalState = (): void => {
    setEditModalOpen(!editModalOpen)
  }

  return (
    <Box marginBottom={'25px'} paddingBottom={1}>
      <Dialog open={editModalOpen} fullWidth maxWidth={'xs'} >
        <DialogTitle>Update Today's Weight</DialogTitle>
        <DialogContent dividers>
          <Box textAlign="right">
            <Formik
              initialValues={{
                todaysWeight: null,
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => logWeight(values)}
              render={formik => (
                <Form>
                  <TextField
                    label="Today's Weight"
                    variant='filled'
                    className="subvariant-dark"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                    }}
                    value={formik.values.todaysWeight} 
                    onChange={formik.handleChange}
                    error={formik.touched.todaysWeight && Boolean(formik.errors.todaysWeight)}
                    helperText={formik.touched.todaysWeight && formik.errors.todaysWeight}
                    onBlur={formik.handleBlur}
                    name="todaysWeight" />

                  <DialogActions sx={{ paddingTop: 2 }}>
                    <Button variant="outlined" onClick={() => setEditModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => updateTodaysWeight(formik.values)} 
                      disabled={!formik.values.todaysWeight || Boolean(formik.errors.todaysWeight)}
                      autoFocus>
                      Update
                    </Button>
                  </DialogActions>
                </Form>
              )}>
            </Formik>
          </Box>
        </DialogContent>
      </Dialog>
      {!props.todaysWeight ? <Formik
        initialValues={{
          todaysWeight: null,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => logWeight(values)}
        render={formik => (
          <Form>
            <Stack direction="row" alignItems="center" spacing={2}>
              <>
                <TextField
                  label="Today's Weight"
                  variant='filled'
                  InputProps={{
                    endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                  }}
                  value={formik.values.todaysWeight} 
                  onChange={formik.handleChange}
                  error={formik.touched.todaysWeight && Boolean(formik.errors.todaysWeight)}
                  helperText={formik.touched.todaysWeight && formik.errors.todaysWeight}
                  onBlur={formik.handleBlur}
                  name="todaysWeight" />
                  <Button
                    type="submit"
                    disabled={!formik.values.todaysWeight || props.todaysWeight ? true : false}
                    onClick={logWeight} 
                    variant="contained"
                    color="primary">
                      Log Weight
                  </Button>
                </>
            </Stack>
          </Form>
        )}>
      </Formik>
      : <Stack direction="column" alignItems="flex-start">
          <Typography variant="h2">{props.todaysWeight}</Typography>
          <Typography variant="overline">Today's Weight</Typography>

          <Button
            sx={{
              marginTop: 2
            }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={props.todaysWeight ? false : true}
            onClick={triggerEditModalState}>
              <EditRoundedIcon sx={{ marginRight: 1 }}></EditRoundedIcon>Edit today's weight
          </Button>
        </Stack>
      }
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
    uid: state.uid,
  }
}

export default connect(mapStateToProps)(WeightLogger);
