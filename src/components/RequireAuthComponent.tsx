import { Navigate } from 'react-router-dom'
import { connect } from 'react-redux'

const RequireAuthComponent = (props: any) => ( props.userLoggedIn ? props.children : <Navigate to="/" />)

const mapStateToProps = state => {
    return {
      userLoggedIn: state.userLoggedIn,
    }
}

export default connect(mapStateToProps)(RequireAuthComponent);