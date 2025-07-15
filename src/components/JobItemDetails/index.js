import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import SimilartItem from '../SimilarItem'
import './index.css'
import Header from '../Header'

const apiStatusConstants = {
  inprogress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    const {similarJobs} = this.state
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const {match} = this.props
    const {id} = match.params

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    const company = data.job_details

    if (response.ok === true) {
      const updatedproductDetails = {
        companyLogoUrl: company.company_logo_url,
        title: company.title,
        rating: company.rating,
        location: company.location,
        jobDescription: company.job_description,
        employmentType: company.employment_type,
        packagePerAnnum: company.package_per_annum,
        skills: company.skills,
        lifeAtCompany: company.life_at_company,
        wesiteUrl: company.company_website_url,
      }

      const updatedsimilarJobs = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobDetails: updatedproductDetails,
        similarJobs: updatedsimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
      console.log(similarJobs)
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="Failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to the page your are looking for</p>
      <button type="button" onClick={this.getProductDetails}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      skills,
      jobDescription,
      lifeAtCompany,
      websiteUrl,
    } = jobDetails

    return (
      <>
        <Header />
        <div className="jobDetails-bgcontainer">
          <div className="jobDetails-container">
            <div className="horizontal-align">
              <img
                src={companyLogoUrl}
                className="companylogo"
                alt="job details company logo"
              />
              <div className="title-container">
                <h1 className="role">{title}</h1>
                <p>{rating}</p>
              </div>
            </div>
            <div className="location-type-pakage">
              <div className="horizontal-align">
                <p className="location">{location}</p>
                <p className="location">{employmentType}</p>
              </div>
              <p>{packagePerAnnum}</p>
            </div>
            <hr />
            <div className="linkcontainer">
              <h1 className="Description">Description</h1>
              <a href={`${websiteUrl}`} target="_blank" rel="noreferrer">
                Visit
              </a>
            </div>
            <p className="job-description">{jobDescription}</p>
            <h1 className="skills-heading">skills</h1>
            <ul className="skills-list">
              {skills.map(each => (
                <li className="skills-item" key={each.name}>
                  <img
                    src={each.image_url}
                    alt={each.name}
                    className="companylogo"
                  />
                  <p className="skills-name">{each.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="skills-heading">Life at Company</h1>
            <div className="skills-at-container">
              <p className="life-at-description">{lifeAtCompany.description}</p>
              <img src={lifeAtCompany.image_url} alt="logo" />
            </div>
          </div>
          <div className="similar-container">
            <h2 className="skills-heading">Similar Jobs</h2>
            <ul className="similarItem-container">
              {similarJobs.map(item => (
                <SimilartItem details={item} key={item.id} />
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  renderResultview = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inprogress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderResultview()}</>
  }
}

export default JobItemDetails
