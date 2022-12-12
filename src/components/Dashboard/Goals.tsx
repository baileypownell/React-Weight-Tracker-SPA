

import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, ListItemIcon, ListItemText, Menu, MenuItem, Snackbar, Stack, TextField, Typography, useTheme } from '@mui/material'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { useWindowWidth } from '@react-hook/window-size'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import firebase from '../../firebase-config'
import Goal, { FormattedGoal } from '../../types/goal'
import LegacyWeight from '../../types/legacy-weight'
import Weight from '../../types/weight'
import DoughnutChart from './DoughnutChart'
import ReduxProps from '../../types/redux-props'

const DEFAULT_DATE_PICKER_VALUE = DateTime.now().plus({ weeks: 4 })

interface Props extends ReduxProps {
    updateGoals: any,
    goals: (FormattedGoal | Goal)[], 
    mostRecentWeight: Weight | LegacyWeight,
}

const Goals = (props: Props) => {
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [goalWeight, setGoalWeight] = useState('')
    const [goalTarget, setGoalTarget] = useState<DateTime | null>(DEFAULT_DATE_PICKER_VALUE) 
    const [goalToDeleteId, setGoalToDeleteId] = useState('')
    const [selectedGoal, setSelectedGoal] = useState<FormattedGoal | null>(null)
    const [showGoalDeleteConfirmationModal, setShowGoalDeleteConfirmationModal] = useState(false)
    const width = useWindowWidth()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (e)  => {
        if (e.target.value > 0 || e.target.value === '') {
            setGoalWeight(e.target.value)
        }
    }

    const addGoal = async () => {
        const db = getFirestore(firebase);
        try {
            const newGoal: Goal = {
                goalWeight: Number(goalWeight), 
                goalTarget: new Date((goalTarget! as any).ts).toISOString(),
                baseWeight: Number(props.mostRecentWeight.weight),
                complete: false, 
                incomplete: false,
                id: uuidv4(),
            }
            await setDoc(doc(db, 'users', props.uid), {
                goals: props.goals.concat(newGoal)
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
        const goal: FormattedGoal = props.goals.find(goal => goal.id === goalId) as FormattedGoal
        setSelectedGoal(goal)
    }

    useEffect(() => setSelectedGoal(props.goals[0] as FormattedGoal), [props.goals])

    const theme = useTheme()

    return (
        <Stack alignItems="flex-start"  direction={ width > 700 ? "row" : "column" } justifyContent="flex-start" spacing={4}>
            <Box width="100%" maxWidth={width > 700 ? "400px" : "none"} minWidth="300px">
                <Stack direction="column" spacing={2} >
                    <Typography variant="overline">Add a goal</Typography>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <DesktopDatePicker
                            disablePast
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
                            backgroundColor: theme.palette.white.main,
                            cursor: 'pointer',
                            position: 'relative',
                            color: 'gray.main',
                            boxShadow: selectedGoal && selectedGoal.id === goal.id ? 
                                `${theme.palette.secondary.main} 3px 3px 20px` : 
                                `none`
                        }}
                        onClick={() => showGraph(goal.id)}>
                        <Stack alignItems="flex-start" width="100%">
                            <Typography variant="overline">Target Weight</Typography>
                            <Typography variant="h6" sx={{ padding: 0 }}>
                                { Number(goal.goalWeight).toFixed(1) } lbs.
                            </Typography>
                            <Stack direction="row" alignItems="flex-end" justifyContent="space-between" width="100%">
                                <Box>
                                    <Typography variant="overline">Goal Date</Typography>
                                    <Typography variant="h6" sx={{ padding: 0 }}>
                                        {(goal as FormattedGoal).formattedGoalDate}
                                    </Typography>
                                </Box>

                                { goal.incomplete ? <Chip color="warning" label="Incomplete" variant="outlined" /> : null }
                                { goal.complete ? <Chip icon={<CheckRoundedIcon />} color="secondary" label="Complete" variant="outlined" /> : null }
                            </Stack>
                        </Stack>
                    
                        <IconButton
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{
                                position: 'absolute',
                                right: '10px'
                            }}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}>
                            <MenuItem onClick={() => openConfirmationDialog(goal.id)}>
                                <ListItemIcon>
                                    <DeleteIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Delete</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Stack>
                ))
            }
            </Box>
            <DoughnutChart selectedGoal={selectedGoal} lastWeight={Number(props.mostRecentWeight.weight)} />
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