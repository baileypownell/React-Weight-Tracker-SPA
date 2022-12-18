import { Box, Button, Stack, Typography, useTheme, Zoom } from '@mui/material'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { FormattedGoal } from '../../types/goal'
import LegacyGoal from '../../types/legacy-goal'

const GOAL_NOTIFIER_HIDDEN = 'goal-notifier-hidden'

const GoalNotifier = (props: { upcomingGoal: FormattedGoal | LegacyGoal | null}) => {
    const [daysLeft, setDaysLeft] = useState<number | null>(null)
    const [visible, setVisible] = useState(false)
    const [goalExpiresToday, setGoalExpiresToday] = useState<boolean | null>(null)
    const { upcomingGoal } = props
    const theme = useTheme()

    useEffect(() => {
        if (upcomingGoal && !window.sessionStorage.getItem(GOAL_NOTIFIER_HIDDEN)) {
            setGoalExpiresToday(DateTime.fromISO(upcomingGoal.goalTarget).hasSame(DateTime.now(), 'day'))
            setDaysLeft(DateTime.fromISO(upcomingGoal.goalTarget).diffNow('days').days)
            setVisible(true)
        }
    }, [upcomingGoal])

    const closeNotification = (): void => {
        window.sessionStorage.setItem(GOAL_NOTIFIER_HIDDEN, 'true')
        setVisible(false)
    }

    if (daysLeft === null || !upcomingGoal) {
        return null
    }

    return (
        <Zoom in={visible}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center" 
                padding={2} 
                boxShadow={20}
                sx={{
                    borderRadius: '50%',
                    backgroundColor: theme.palette.secondary.main,
                    width: '600px',
                    height: '600px',
                    position: 'absolute',
                    bottom: '-300px',
                    right: '-100px',
                    boxShadow: `10px 10px 30px black`
                }}>
                <Stack paddingBottom="200px" textAlign="center" alignItems="center">
                    { daysLeft >= 1 ? 
                        <Stack maxWidth="350px">
                            <Typography variant="h5">
                                Your next goal of {upcomingGoal.goalWeight} lbs. <br/> is set for {(upcomingGoal as FormattedGoal).formattedGoalDate}
                            </Typography>
                            <Typography marginTop={2} variant="body1">
                                Only {Math.round(daysLeft)} more {Math.round(daysLeft) > 1 ? 'days' : 'day'} to go!
                                </Typography>
                        </Stack> 
                    : null }

                    { daysLeft < 1 && !goalExpiresToday ? 
                        <Box maxWidth="350px">
                            <Typography variant="h5">Tomorrow is the target date for your upcoming goal!</Typography>
                        </Box> 
                    : null }

                    { goalExpiresToday ? 
                        <Box maxWidth="350px">
                            <Typography variant="h5">Today is the target date for your upcoming goal!</Typography>
                        </Box> 
                    : null }

                    <Button 
                        sx={{
                            marginTop: 2,
                            backgroundColor: theme.palette.gray.main,
                            '&:hover': {
                                backgroundColor: theme.palette.gray.dark,
                            }
                        }}
                        onClick={closeNotification} 
                        variant="contained">
                        Dismiss
                    </Button>
                </Stack>
                
            </Box>
        </Zoom>
    )
}

const mapStateToProps = state => {
    return {
      uid: state.uid,
    }
  }

export default connect(mapStateToProps)(GoalNotifier);