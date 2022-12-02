import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Button, Stack, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = (props) => {
  const navigate = useNavigate()
  
  const directUser = (): void => {
    navigate(props.userLoggedIn ? '/dashboard' : '/login');
  }

  return (
    <Box 
      boxShadow={10}
      borderRadius={1} 
      padding={3}
      sx={{ backgroundColor: 'grey.main' }}>
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
            <Typography>is simple to use</Typography>
            <CheckCircleIcon sx={{ marginLeft: 1 }} /></Stack>
          <Stack direction="row">
            <Typography>enables you to set goals for yourself</Typography>
            <CheckCircleIcon sx={{ marginLeft: 1 }} /></Stack>
          <Stack direction="row" alignItems="center">
            <Typography>and most importantly, is completely
              <span style={{
                fontSize: '1.5rem',
                fontFamily: "'Caveat', cursive",
                marginLeft: '5px'
              }}>free</span>
            </Typography>
            <CheckCircleIcon sx={{ marginLeft: 1 }} />
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
