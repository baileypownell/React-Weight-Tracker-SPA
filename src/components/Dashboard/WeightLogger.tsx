import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import firebase from '../../firebase-config'

export const WeightLogger = (props) => {

  const [todaysWeight, setTodaysWeight] = useState<number | string>('');
  const [updatedWeight, setUpdatedWeight] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [formInputEmpty, setFormInputEmpty] = useState(true);

  const handleChange = (e) => {
    const numValue = e.target.value.replace(/[^0-9.]/g, '')
    setTodaysWeight(numValue)
  }

  useEffect(() => {
    setFormInputEmpty(!(todaysWeight > 1))
  }, [todaysWeight])

  const handleUpdateChange = (e) => {
    const numValue = e.target.value.replace(/[^0-9.]/g, '')
    setUpdatedWeight(numValue)
  }

  const logWeight = () => {
    const db = getFirestore(firebase);
    let date = new Date();
    let updatedWeights = props.weights.concat({
      date: {date},
      weight: todaysWeight
    });
    const userRef = doc(db, 'users', props.uid);
    setDoc(userRef, { weights: updatedWeights }, { merge: true })
    props.updateWeightHistory()
    setTodaysWeight('');
  } 
  
  const updateTodaysWeight = () => {
    let allWeights = props.weights
    let recordToUpdate = allWeights[0]
    recordToUpdate.weight = updatedWeight
    const db = getFirestore(firebase);
    const userRef = doc(db, 'users', props.uid);
    setDoc(userRef, { weights: allWeights }, { merge: true })
    setSnackBarMessage('Weight updated.')
    props.updateWeightHistory()
    setUpdatedWeight('')
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
            <TextField
              label="Weight"
              value={updatedWeight}
              variant="filled"
              onChange={handleUpdateChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
              }} />
            </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setEditModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={updateTodaysWeight} autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <form>
        <Stack direction="row" alignItems="center" spacing={2}>
          {!props.todaysWeight ? 
            <TextField
              label='Record Weight'
              variant='filled'
              InputProps={{
                endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
              }}
              value={todaysWeight} 
              onChange={handleChange} />
            : null }
            
            {!props.todaysWeight ? 
              <Button
                disabled={formInputEmpty || props.todaysWeight ? true : false}
                onClick={logWeight} 
                variant="contained"
                color="primary">
                  Log Weight
              </Button>
              : 
              <Button
                variant="contained"
                color="primary"
                disabled={props.todaysWeight ? false : true}
                onClick={triggerEditModalState}>
                  Edit today's weight
              </Button>
            }
         </Stack>
      </form>
      { props.todaysWeight ? 
        <Stack direction="column">
          <Typography variant="h2">{props.todaysWeight}</Typography>
          <Typography variant="overline">Today's Weight</Typography>
        </Stack>
          : null 
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
