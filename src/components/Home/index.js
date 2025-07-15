import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div className="home-bgcontainer">
    <Header />
    <div className="home-container">
      <h1 className="home-heading">Find The Job That Fits Your Life</h1>
      <p className="paragraph">
        Millions of people are searching for jobs, salary information, company
        reviews. Find the job the fits your abilities and potential
      </p>
      <Link to="/jobs">
        <button type="button" className="findjobs-btn">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
