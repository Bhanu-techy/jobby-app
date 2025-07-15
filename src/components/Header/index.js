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
        <li className="navlist-items">
          <Link to="/">
            <li className="navlist">Home</li>
          </Link>
          <Link to="/jobs">
            <li className="navlist">Jobs</li>
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
