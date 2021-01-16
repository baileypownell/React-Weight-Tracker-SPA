import React from 'react'
import { Redirect } from "react-router-dom"
import { connect } from 'react-redux'

class RequireAuthComponent extends React.Component {

    state = {
        userAuthenticated: this.props.userLoggedIn
    }

    render() {
        const { userAuthenticated } = this.state
        return (
            <>
             { userAuthenticated ? this.props.children : <Redirect to="/login" /> }   
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
      userLoggedIn: state.userLoggedIn,
    }
}

export default connect(mapStateToProps)(RequireAuthComponent);