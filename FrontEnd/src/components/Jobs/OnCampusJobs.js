import React, { useEffect, useState } from 'react';
import { Spin, Row, Col, message } from 'antd';
import DefaultLayout from '../DefaultLayout';
import { JobCard } from './JobCard';
import { jobAPI } from '../../utils/api';

function OnCampusJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOnCampusJobs = async () => {
      setLoading(true);
      try {
        const response = await jobAPI.getJobs({
          campus: 'on-campus' // Filter for on-campus jobs only
        });

        if (response.success) {
          setJobs(response.data || []);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error('Error fetching on-campus jobs:', err);
        message.error('Failed to fetch on-campus jobs');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOnCampusJobs();
  }, []);

  const handleJobUpdate = () => {
    // Refresh jobs list after update
    const fetchJobs = async () => {
      const response = await jobAPI.getJobs({
        campus: 'on-campus'
      });
      if (response.success) {
        setJobs(response.data || []);
      }
    };
    fetchJobs();
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>Loading on-campus jobs...</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div style={{ padding: '20px' }}>
        <h1 style={{ marginBottom: '30px' }}>On-Campus Job Opportunities</h1>

        {jobs.length > 0 ? (
          <Row gutter={[16, 16]}>
            {jobs.map((job, index) => (
              <Col key={job._id || index} xs={24} sm={12} lg={8} xl={6}>
                <JobCard job={job} onUpdate={handleJobUpdate} />
              </Col>
            ))}
          </Row>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>No On-Campus Jobs Available</h3>
            <p>There are currently no on-campus job opportunities posted.</p>
            <p>Check back later or contact the career services office for more information.</p>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export default OnCampusJobs;