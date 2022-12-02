import { Box, Snackbar, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { calculateTodaysWeight } from '../../calculate-todays-weight'
import { compare, compareGoals } from '../../compare'
import { determineGoalStatus } from '../../determine-goal-status'
import firebase from '../../firebase-config'
import Goals from './Goals'
import LineGraph from './LineGraph'
import RecentWeightLogs from './RecentWeightLogs'
import Settings from './Settings'
import WeightLogger from './WeightLogger'

enum DisplayOptions {
  History,
  Goals,
  Settings
}

const formattedGoalDate = (targetDate: string) => {
  // previously, dates were not already saved in ISO (bad decision)
  const forceToISO = new Date(targetDate).toISOString()
  return DateTime.fromISO(forceToISO).toLocaleString(DateTime.DATE_FULL)
}

const Dashboard = (props) => {
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [sortedWeights, setSortedWeights] = useState<number[]>([])
  const [loaded, setLoaded] = useState(false) 
  const [goals, setGoals] = useState<any[]>([])
  // const [primaryGoal, setPrimaryGoal] = useState(null)
  const [tabValue, setTabValue] = useState(DisplayOptions.History)

  const evaluateDashboardData = async () => {
    const db = getFirestore(firebase);
    const docRef = doc(db, 'users', props.uid);
    console.log(getAuth(firebase))
    try {
      const docSnap = await getDoc(docRef);
      const weightHistory = docSnap.data()?.weights;
      const goalHistory = docSnap.data()?.goals?.length ? 
        docSnap.data()?.goals.map(goal => ({...goal, formattedGoalDate: formattedGoalDate(goal.goalTarget)}))
        : [];

      if (weightHistory) {
        const sortedAllWeightsRecorded = weightHistory.sort(compare)
        setSortedWeights(sortedAllWeightsRecorded)
      }
      if (goalHistory) {
        const sortedGoals = goalHistory.sort(compareGoals)
        setGoals(sortedGoals)
      }

      try {
        const lastWeight = sortedWeights.length ? sortedWeights[0].weight : null
        const goalStatus = await determineGoalStatus(goals, lastWeight, props.uid)
        setLoaded(true)

        if (goalStatus.updatedGoals) {
          const futureGoals = goalStatus.updatedGoals.filter(goal => !goal.complete && !goal.incomplete)
          setGoals(goalStatus.updatedGoals)
          // setPrimaryGoal(futureGoals[0])
        } else {
          const futureGoals = goals.filter(goal => !goal.complete && !goal.incomplete)
          // setPrimaryGoal(futureGoals[0])
        }
      } catch (error) {
        setSnackBarMessage('There was an error.')
        console.log(`Error: ${error}`) 
      }
    } catch(error) {
      setSnackBarMessage('There was an error.')
      console.log(`Error: ${error}`)
    }
  }

  useEffect(() => {
    evaluateDashboardData()
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const todaysWeight = calculateTodaysWeight(sortedWeights)

  return (
    <Stack 
      direction="row" 
      sx={{ boxShadow: 10, backgroundColor: 'grey.main' }} 
      padding={5} 
      width={'100%'} 
      height={'100%'}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={tabValue}
        onChange={handleTabChange}
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="History" />
        <Tab label="Goals" />
        <Tab label="Settings" />
      </Tabs>
      <Box flexGrow={1}>
        <TabPanel value={tabValue} index={0}>
          <Stack spacing={5} direction="row">
            <Box>
              <WeightLogger 
                weights={sortedWeights} 
                todaysWeight={todaysWeight}
                updateWeightHistory={evaluateDashboardData}
              />
            { sortedWeights.length ? <LineGraph weights={sortedWeights} /> : null }
            </Box>

            <Box flexGrow={1}>
              <RecentWeightLogs weights={sortedWeights} /> 
            </Box>
          </Stack> 
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          { sortedWeights.length ? <Goals 
                updateGoals={evaluateDashboardData} 
                goals={goals} 
                weights={sortedWeights} /> 
            : <Stack>
                <Typography variant="h5">Goals</Typography>
                <Typography marginTop={3}>Record at least one weight to add a goal.</Typography>
              </Stack> }
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Settings />
        </TabPanel>
      </Box>
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
    userLoggedIn: state.userLoggedIn,
    uid: state.uid,
  }
}

export default connect(mapStateToProps)(Dashboard);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}