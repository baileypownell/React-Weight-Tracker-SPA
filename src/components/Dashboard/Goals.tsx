

import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, Snackbar, Stack, TextField, Typography, useTheme } from '@mui/material'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import DeleteIcon from '@mui/icons-material/Delete'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import firebase from '../../firebase-config'
import DoughnutChart from './DoughnutChart'

const DEFAULT_DATE_PICKER_VALUE = DateTime.now().plus({ weeks: 4 })

const Goals = (props:  {
    updateGoals: any,
    goals: any[], 
    weights: any[],
}) => {
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [goalWeight, setGoalWeight] = useState('')
    const [goalTarget, setGoalTarget] = useState(DEFAULT_DATE_PICKER_VALUE) 
    const [goalToDeleteId, setGoalToDeleteId] = useState('')
    const [selectedGoal, setSelectedGoal] = useState(null)
    const [showGoalDeleteConfirmationModal, setShowGoalDeleteConfirmationModal] = useState(false)

    useEffect(() => {
        setSelectedGoal(props.goals[0])
    }, [])

    const handleChange = (e)  => {
        if (e.target.value > 0 || e.target.value === '') {
            setGoalWeight(e.target.value)
        }
    }

    const addGoal = async () => {
        const db = getFirestore(firebase);
        try {
            const newWeight = {
                goalWeight, 
                goalTarget: new Date(goalTarget.ts).toISOString(),
                baseWeight: props.weights[0].weight,
                complete: false, 
                incomplete: false,
                id: uuidv4(),
            }
            await setDoc(doc(db, 'users', props.uid), {
                goals: props.goals.concat(newWeight)
            }, { merge: true });
            setSnackBarMessage('Goal added!')
            setGoalWeight('')
            setGoalTarget(DEFAULT_DATE_PICKER_VALUE)
            props.updateGoals()
        } catch(error) {
            console.log(error)
            setSnackBarMessage('There was an error.')
        }
    }

    const deleteGoal = async () => {
        let updatedGoals = props.goals.filter(goal => goal.id !== goalToDeleteId)
        const db = getFirestore(firebase);
        try {
            await setDoc(doc(db, 'users', props.uid), {
                goals: updatedGoals
            }, { merge: true })
            setSnackBarMessage('Goal deleted.')
            setSelectedGoal(null)
            setShowGoalDeleteConfirmationModal(false)
            props.updateGoals()
        } catch(error) {
            console.log(error)
            setSnackBarMessage('There was an error.')
        }
    }

    const openConfirmationDialog = (goalId: string) => {
        setGoalToDeleteId(goalId)
        setShowGoalDeleteConfirmationModal(true)
    }

    const closeConfirmationDialog = () => {
        setShowGoalDeleteConfirmationModal(false)
    }

    const showGraph = (goalId: string): void => {
        const goal = props.goals.find(goal => goal.id === goalId)
        setSelectedGoal(goal)
    }

    useEffect(() => {
        if (props.goals.length === 1) {
            setSelectedGoal(props.goals[0])
        }
    }, [props.goals])

    const theme = useTheme()

    return (
        <Stack alignItems="flex-start"  direction="row" justifyContent="flex-start" spacing={4}>
            <Box minWidth="400px">
                <Stack direction="column" spacing={2} >
                    <Typography variant="overline">Add a goal</Typography>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <DesktopDatePicker
                            label="Select goal target date"
                            value={goalTarget}
                            onChange={(e) => setGoalTarget(e)}
                            renderInput={(params) => <TextField variant="filled" {...params} />}
                            />
                    </LocalizationProvider>
                    <TextField 
                        variant="filled"
                        value={goalWeight}
                        label="Enter a target weight"
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                        }} />
                    <Button 
                        onClick={addGoal}
                        variant="contained"
                        color="secondary"
                        disabled={goalTarget && goalWeight ? false : true}>
                        Add Goal
                    </Button>
                </Stack>
                {props.goals.map((goal, index) => (
                    <Stack 
                        key={index}
                        padding={1}
                        marginTop={'20px'}
                        marginBottom={'20px'}
                        borderRadius={'5px'}
                        alignItems="baseline"
                        sx={{
                            transition: 'all .4s',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            position: 'relative',
                            color: 'grey.main',
                            boxShadow: selectedGoal && selectedGoal.id === goal.id ? 
                                `${theme.palette.secondary.main} 3px 3px 20px` : 
                                `none`
                        }}
                        onClick={() => showGraph(goal.id)}>
                        <Stack alignItems="flex-start">
                            <Typography variant="overline">Target Weight</Typography>
                            <Typography variant="h6" sx={{ padding: 0 }}>
                                { Number(goal.goalWeight).toFixed(1) } lbs.
                            </Typography>
                            <Typography variant="overline">Goal Date</Typography>
                            <Typography variant="h6" sx={{ padding: 0 }}>
                                {goal.formattedGoalDate}
                            </Typography>
                            { goal.incomplete ? <Chip label="Incomplete" variant="outlined" /> : null }
                            { goal.complete ? <Chip icon={<DoneIcon />} color="secondary" label="Complete" variant="outlined" /> : null }
                        </Stack>
                        
                        <Button 
                            variant="contained" 
                            sx={{
                                position: 'absolute',
                                borderTopRightRadius: '5px',
                                borderBottomRightRadius: '5px',
                                borderBottomLeftRadius: '0',
                                borderTopLeftRadius: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                top: 0,
                                bottom: 0, 
                                right: 0,
                                height: '100%',
                                transition: 'background-color .3s',
                                // background-color: $warning;
                                // &:hover: {
                                //     backgroundColor: lighten($warning, 5%);
                                // }
                                i: {
                                    cursor: 'pointer',
                                    color: 'white',
                                    fontSize: '20px',
                                }
                            }}
                            onClick={() => openConfirmationDialog(goal.id)}>
                            <DeleteIcon />
                        </Button>
                    </Stack>
                ))
            }
            </Box>
            <DoughnutChart selectedGoal={selectedGoal} lastWeight={Number(props.weights[0].weight)} />
            <Dialog open={showGoalDeleteConfirmationModal}>
                <DialogTitle>Confirm Goal Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your goal?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button 
                    variant="outlined" 
                    onClick={closeConfirmationDialog}>
                    Cancel
                </Button>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={deleteGoal} autoFocus>
                    Confirm
                </Button>
                </DialogActions>
            </Dialog>      
            <Snackbar
                open={!!snackBarMessage.length}
                autoHideDuration={6000}
                onClose={() => setSnackBarMessage('')}
                message={snackBarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
    </Stack>
    )
}

const mapStateToProps = state => {
    return {
        uid: state.uid,
    }
  }

export default connect(mapStateToProps)(Goals);