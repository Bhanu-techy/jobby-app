import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItems from '../JobItems'
import './index.css'

const apiStatusConstants = {
  inprogress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    apiJobsStatus: apiJobsStatusConstants.initial,
    searchInput: '',
    minimumSalary: 0,
    employmentType: [],
  }

  componentDidMount() {
    this.getJobDetails()
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})

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
    if (response.ok === true) {
      const updatedprofileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedprofileDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, employmentType, minimumSalary} = this.state
    console.log(minimumSalary)

    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${minimumSalary}&search=${searchInput}`
    const optionsJobs = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseJobs = await fetch(jobsApiUrl, optionsJobs)
    if (responseJobs.ok === true) {
      const fetchedDataJobs = await responseJobs.json()
      const updatedDataJobs = fetchedDataJobs.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobsList: updatedDataJobs,
        apiJobsStatus: apiJobsStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiJobsStatusConstants.failure})
    }
  }

  onRetryProfile = () => {
    this.getProfileDetails()
  }

  onChangeSalary = salary => {
    this.setState({minimumSalary: salary}, this.getJobDetails)
  }

  onGetProfileFailureView = () => (
    <button type="button" onClick={this.onRetryProfile}>
      Retry
    </button>
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

  changeEmployeeList = type => {
    this.setState(
      prevState => ({
        employmentType: [...prevState.employmentType, type],
      }),
      this.getJobDetails,
    )
    console.log(type)
  }

  onRenderProfileStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onGetProfileView()
      case apiStatusConstants.failure:
        return this.onGetProfileFailureView()
      case apiStatusConstants.inprogress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value}, this.getJobDetails)
    console.log(event.target)
  }

  onGetJobsView = () => {
    const {jobsList} = this.state
    const noJobsview = jobsList.length > 0 ? 'nojobcss' : ''
    const jobsview = jobsList.length > 0 ? '' : 'nojobcss'
    return (
      <>
        <ul className={`${jobsview}`}>
          {jobsList.map(each => (
            <JobItems jobdetails={each} key={each.id} />
          ))}
        </ul>
        <div className={`no-jobs-container ${noJobsview}`}>
          <img
            className="no-jobs-img"
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters.</p>
          <button type="button" onClick={this.getJobDetails}>
            Retry
          </button>
        </div>
      </>
    )
  }

  onGetJobsFailureView = () => (
    <div className="Failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page your are looking for</p>
      <button type="button" className="retrybtn" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  onRenderJobsStatus = () => {
    const {apiJobsStatus} = this.state

    switch (apiJobsStatus) {
      case apiJobsStatusConstants.success:
        return this.onGetJobsView()
      case apiJobsStatusConstants.failure:
        return this.onGetJobsFailureView()
      case apiJobsStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderSuccessView = () => {
    const {searchInput} = this.state

    return (
      <div className="jobs-container">
        <div className="jobs-left-container">
          {this.onRenderProfileStatus()}
          <hr className="left-line" />
          <h1 className="employmentType-heading">Type of Employment</h1>
          <ul>
            {employmentTypesList.map(each => {
              const onSelectEmploymetType = () => {
                this.changeEmployeeList(each.employmentTypeId)
              }
              return (
                <li key={each.employmentTypeId} className="employmentType">
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    className="checkbox"
                    value={each.employmentTypeId}
                    onChange={onSelectEmploymetType}
                  />
                  <label htmlFor={each.employmentTypeId}>{each.label}</label>
                </li>
              )
            })}
          </ul>
          <hr className="left-line" />
          <h1 className="employmentType-heading">Salary Range</h1>
          <ul>
            {salaryRangesList.map(each => {
              const changeSalary = () => {
                this.onChangeSalary(each.salaryRangeId)
              }
              const salaryId = each.salaryRangeId
              return (
                <li className="employmentType" key={each.salaryRangeId}>
                  <input
                    type="radio"
                    className="checkbox"
                    id={salaryId}
                    onChange={changeSalary}
                  />
                  <label htmlFor={salaryId}>{each.label}</label>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="jobs-right-container">
          <div className="search-bar">
            <input
              type="search"
              id="searchbox"
              className="searchbox"
              value={searchInput}
              onChange={this.onChangeSearchInput}
            />
            <button
              type="button"
              className="searchbtn"
              data-testid="searchButton"
              onClick={this.getJobDetails}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div>{this.onRenderJobsStatus()}</div>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderResultView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inprogress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobs-bgcontainer">
        <Header />
        {this.renderResultView()}
      </div>
    )
  }
}

export default Jobs
