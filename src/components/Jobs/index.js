import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItems from '../JobItems'
import ProfileItem from '../ProfileItem'

import './index.css'

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

const locationList = [
  {locationId: 'HYDERABAD', label: 'Hyderabad'},
  {
    locationId: 'BANGALORE',
    label: 'Bangalore',
  },
  {
    locationId: 'CHENNAI',
    label: 'Chennai',
  },
  {
    locationId: 'DELHI',
    label: 'Delhi',
  },
  {
    locationId: 'MUMBAI',
    label: 'Mumbai',
  },
]

class Jobs extends Component {
  state = {
    jobsList: [],
    apiJobsStatus: apiJobsStatusConstants.initial,
    searchInput: '',
    minimumSalary: '',
    employmentType: [],
    locationarr: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState(
      {apiJobsStatus: apiJobsStatusConstants.inProgress},
      this.getProfileDetails,
    )

    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, employmentType, minimumSalary} = this.state

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

  changeEmployeeList = (type, isChecked) => {
    this.setState(
      prevState => ({
        employmentType: isChecked
          ? [...prevState.employmentType, type]
          : prevState.employmentType.filter(t => t !== type),
      }),
      this.getJobDetails,
    )
  }

  onChangeSalary = salary => {
    this.setState({minimumSalary: salary}, this.getJobDetails)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchBtn = () => {
    this.getJobDetails()
  }

  onEnterSearch = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  onChangeLocation = location => {
    this.setState(prevState => ({
      locationarr: [...prevState.locationarr, location],
    }))
  }

  onGetJobsView = () => {
    const {jobsList, locationarr} = this.state

    console.log(locationarr)

    const newList =
      locationarr.length > 0
        ? jobsList.filter(job =>
            locationarr.some(loc => job.location.toUpperCase() === loc),
          )
        : jobsList

    const noJobsview = jobsList.length > 0 ? 'nojobcss' : ''
    const jobsview = jobsList.length > 0 ? '' : 'nojobcss'
    return (
      <>
        <ul className={`${jobsview}`}>
          {newList.map(each => (
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
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="retrybtn" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  onRenderJobsStatus = () => {
    const {apiJobsStatus} = this.state

    switch (apiJobsStatus) {
      case apiJobsStatusConstants.inProgress:
        return this.renderLoader()
      case apiJobsStatusConstants.success:
        return this.onGetJobsView()
      case apiJobsStatusConstants.failure:
        return this.onGetJobsFailureView()

      default:
        return null
    }
  }

  renderSuccessView = () => {
    const {searchInput} = this.state

    return (
      <div className="jobs-container">
        <div className="jobs-left-container">
          <div>
            <ProfileItem />
            <hr className="left-line" />
          </div>

          <div className="ul-list-cont">
            <h1 className="employmentType-heading">Type of Employment</h1>
            <ul>
              {employmentTypesList.map(each => {
                const onSelectEmploymetType = e => {
                  const isChecked = e.target.checked
                  this.changeEmployeeList(each.employmentTypeId, isChecked)
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
          </div>

          <div className="ul-list-cont">
            <h1 className="employmentType-heading">Salary Range</h1>
            <ul>
              {salaryRangesList.map(each => {
                const changeSalary = () => {
                  this.onChangeSalary(each.salaryRangeId)
                }
                const salaryId = each.salaryRangeId
                return (
                  <li className="Salarytype" key={each.salaryRangeId}>
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
            <hr className="left-line" />
          </div>
          <div>
            <h1 className="employmentType-heading">Location</h1>
            <ul className="location-list">
              {locationList.map(each => (
                <li key={each.locationId}>
                  <input
                    type="checkbox"
                    className="checkbox"
                    id={each.locationId}
                    onChange={() => this.onChangeLocation(each.locationId)}
                  />
                  <label htmlFor={each.locationId}>{each.label}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="jobs-right-container">
          <div className="search-bar">
            <input
              type="search"
              data-testid="searchbox"
              className="searchInput"
              value={searchInput}
              onChange={this.onChangeSearchInput}
              onKeyDown={this.onEnterSearch}
            />
            <button
              type="button"
              className="searchbtn"
              data-testid="searchButton"
              onClick={this.onClickSearchBtn}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div>{this.onRenderJobsStatus()}</div>
        </div>
      </div>
    )
  }

  renderLoader = () => {
    const {apiJobsStatus} = this.state
    if (apiJobsStatus === apiJobsStatusConstants.inProgress) {
      return (
        <div data-testid="loader" className="loader-container">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }
    return null
  }

  renderFailureView = () => (
    <button type="button" onClick={this.getProfileDetails}>
      Retry
    </button>
  )

  render() {
    return (
      <div className="jobs-bgcontainer">
        <Header />
        {this.renderSuccessView()}
      </div>
    )
  }
}

export default Jobs
