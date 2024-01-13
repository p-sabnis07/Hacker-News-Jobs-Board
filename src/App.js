import React, { useEffect, useState } from 'react';
import './styles.css';

function App() {
  const [jobPostings, setJobPostings] = useState([]);
  const [visibleJobs, setVisibleJobs] = useState(6);
  const [hasMorePostings, setHasMorePostings] = useState(true);

  useEffect(() => {
    // Fetch job postings from Hacker News API
    fetch('https://hacker-news.firebaseio.com/v0/jobstories.json')
      .then(response => response.json())
      .then(jobIds => {
        // Display the latest job postings
        const remainingJobs = jobIds.length - visibleJobs;
        const jobsToFetch = Math.min(remainingJobs, 6);

        if (jobsToFetch > 0) {
          Promise.all(jobIds.slice(0, visibleJobs).map(jobId =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${jobId}.json?print=pretty`)
              .then(response => response.json())
          ))
            .then(jobs => setJobPostings(jobs))
            .catch(error => console.error('Error fetching data:', error));
        } else {
          setHasMorePostings(false);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [visibleJobs]);

  const handleLoadMore = () => {
    // Increase the number of visible jobs
    setVisibleJobs(prevVisibleJobs => prevVisibleJobs + 6);
  };

  const openJobDetails = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="App">
      <h2>Hacker News Jobs Board</h2>
      <div id="job-board">
        {jobPostings.map(job => (
          <div key={job.id} className="job-posting">
            <div className="job-title" onClick={() => openJobDetails(job.url)}>
              {job.title}
            </div>
            <div className="job-info">
              <div className="poster-date">
                <span className="poster">By {job.by}</span>
                <span className="date-posted"> - {new Date(job.time * 1000).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {hasMorePostings && (
        <button onClick={handleLoadMore}>Load More Jobs</button>
      )}
    </div>
  );
}

export default App;
