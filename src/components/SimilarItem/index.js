import './index.css'

const SimilarItem = props => {
  const {details} = props
  const {
    companyLogoUrl,
    employmentType,

    jobDescription,
    location,
    rating,
    title,
  } = details

  return (
    <li className="similarlist-container">
      <div className="horizontal-align">
        <img
          src={companyLogoUrl}
          className="companylogo"
          alt="similar job company logo"
        />
        <div className="title-container">
          <h1 className="Role">{title}</h1>
          <p>{rating}</p>
        </div>
      </div>
      <h1 className="heading-desc">Description</h1>
      <p>{jobDescription}</p>
      <div className="location-type-pakage">
        <div className="space-between">
          <p className="location">{location}</p>
          <p className="location">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarItem
