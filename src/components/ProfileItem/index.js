import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import './index.css'

const apiStatusConstants = {
  inprogress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class ProfileItem extends Component {
  state = {apiStatus: apiStatusConstants.inprogress, profileDetails: {}}

  componentDidMount() {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    const data = await response.json()

    if (response.ok) {
      const updatedprofileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedprofileDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetryProfile = () => {
    this.getProfileDetails()
  }

  onGetProfileFailureView = () => (
    <div className="Profile-loader">
      <button type="button" className="retrybtn" onClick={this.onRetryProfile}>
        Retry
      </button>
    </div>
  )

  onGetProfileView = () => {
    const {profileDetails} = this.state

    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-card">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="short-info">{shortBio}</p>
      </div>
    )
  }

  renderProfileLoader = () => (
    <div data-testid="loader" className="Profile-loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRenderProfileStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inprogress:
        return this.renderProfileLoader()
      case apiStatusConstants.success:
        return this.onGetProfileView()
      case apiStatusConstants.failure:
        return this.onGetProfileFailureView()

      default:
        return null
    }
  }

  render() {
    return <>{this.onRenderProfileStatus()}</>
  }
}

export default ProfileItem
