import DashboardIcon from '@mui/icons-material/Dashboard'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, useTheme } from '@mui/material'
import { useState } from 'react'
import { connect } from 'react-redux'
import { Link, useNavigate } from "react-router-dom"
import logoWide from '../assets/default-dark-monochrome.svg'
import * as actions from '../store/actionCreators'

const Nav = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const theme = useTheme()

  const logout = () => {
    props.logoutUser()
    navigate('/')
  }

  return (
    <>
      <Stack 
        padding={2} 
        direction="row" 
        alignItems='center' 
        alignContent='center' 
        justifyContent='space-between'
        sx={{ 
          backgroundColor: theme.palette.white.main,
          '& button ': {
            backgroundColor: 'transparent !important',
            marginTop: '0 !important',
             '&:hover': {
              backgroundColor: 'transparent !important'
            },
            '&:focus': {
              outline: 'none !important'
            }
          } 
        }}>      
          <Box>
            <Link to="/" >
              <img style={{
                width: '200px',
                display: 'block',
                margin: '0 auto',
              }}
              title="logo" 
              src={logoWide}></img>
            </Link>
          </Box>
          <IconButton onClick={() => setOpen(!open)}><MenuIcon color="primary"></MenuIcon></IconButton>
      </Stack>

      <Drawer
        anchor='right'
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box
          paddingTop={3}
          sx={{ width: 250 }}
          role="presentation"
        >
          <List>
            { props.userLoggedIn ? 
                <>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/dashboard')}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary='Dashboard' />
                    </ListItemButton>
                  </ListItem>
                </> : (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => navigate('/signup')}>
                        <ListItemIcon>
                          <PersonAddIcon />
                        </ListItemIcon>
                        <ListItemText primary="Create Account"></ListItemText>
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => navigate('/login')}>
                        <ListItemIcon>
                          <LoginIcon />
                        </ListItemIcon>
                        <ListItemText primary="Login"></ListItemText>
                      </ListItemButton>
                    </ListItem>
                  </>
              )
            }
          </List>
          <Divider />
          {props.userLoggedIn ? (
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={logout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Log Out"></ListItemText>
                </ListItemButton>
              </ListItem></List> 
          ) : null }
        </Box>
      </Drawer>
    </>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: () => dispatch(actions.logoutUserAsync())
  }
}

const mapStateToProps = state => {
  return {
    userLoggedIn: state.userLoggedIn,
    expiresIn: state.expiresIn,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
