import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = (props) => {
  const navigate = useNavigate()
  const theme = useTheme()
  
  const directUser = (): void => {
    navigate(props.userLoggedIn ? '/dashboard' : '/login');
  }

  return (
    <Box 
      boxShadow={10}
      padding={3}
      sx={{ 
        backgroundColor: 'grey.main',
        [theme.breakpoints.up('md')]: {
          minWidth: 500,
          borderRadius: 1
        },
      }}>
      <Typography variant='h5'>It's never been <br/>
      <span 
        style={{ 
          fontFamily: "'Caveat', cursive",
          fontSize: '70px'
        }}>easier</span>
      <br/> to track your progress.</Typography>

      <Box 
        paddingTop={'3rem'}>
        <Typography 
          variant='body1' 
          paddingBottom={1.5}
          sx={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: '2rem',
          }}>happy balance</Typography>
        <Stack paddingBottom={'2rem'}>
          <Stack direction="row">
            <CheckCircleIcon sx={{ marginRight: 1 }} />
            <Typography>is simple to use</Typography>
          </Stack>
          <Stack direction="row">
            <CheckCircleIcon sx={{ marginRight: 1 }} />
            <Typography>enables you to set goals for yourself</Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <CheckCircleIcon sx={{ marginRight: 1 }} />
            <Typography>and most importantly, is completely free</Typography>
          </Stack>
        </Stack>
      </Box>

      <Button 
        variant="outlined"
        color="primary"
        onClick={directUser}>
        Get Started
      </Button>
    </Box>
  )
}

const mapStateToProps = state => {
  return {
    userLoggedIn: state.userLoggedIn
  }
}

export default connect(mapStateToProps)(Home);
