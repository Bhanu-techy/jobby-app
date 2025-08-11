import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history} = props
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navbar">
      <ul className="nav-header">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="websitelogo"
            />
          </Link>
        </li>
        <li className="navlist">
          <Link to="/" className="navlist">
            Home
          </Link>
        </li>
        <li className="navlist">
          <Link to="/jobs" className="navlist">
            Jobs
          </Link>
        </li>
        <li>
          <button type="button" className="logoutbtn" onClick={onClickLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
