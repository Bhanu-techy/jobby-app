import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  submitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  enterPassword = event => {
    this.setState({password: event.target.value})
  }

  enterUsername = event => {
    this.setState({username: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  render() {
    const {showSubmitError, errorMsg, username, password} = this.state
    return (
      <div className="login-bgcontainer">
        <form className="login-card" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="website-logo"
            alt="website logo"
          />
          <div className="input-div">
            <label htmlFor="username" className="login-label">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              onChange={this.enterUsername}
              value={username}
              className="input"
            />
          </div>
          <div className="input-div">
            <label htmlFor="password" className="login-label">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="input"
              placeholder="Password"
              onChange={this.enterPassword}
              value={password}
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
          {showSubmitError && <p className="errormsg">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
