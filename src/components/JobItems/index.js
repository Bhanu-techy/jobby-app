import './index.css'
import {Link} from 'react-router-dom'

const JobItems = props => {
  const {jobdetails} = props
  const {
    title,
    id,
    location,
    packagePerAnnum,
    companyLogoUrl,
    employmentType,
    jobDescription,
    rating,
  } = jobdetails

  return (
    <Link to={`/jobs/${id}`}>
      <li className="jobs-card">
        <div className="job-card-header">
          <div>
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="job details company logo"
            />
          </div>
          <div className="job-card-title">
            <h1 className="title">{title}</h1>
            <p>{rating}</p>
          </div>
        </div>
        <div className="job-card-mid">
          <div className="horizontal-align">
            <p className="location">{location}</p>
            <p className="location">{employmentType}</p>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr className="job-card-line" />

        <h1 className="description-heading">Description</h1>

        <p className="description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItems
