import React, { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';
import axios from 'axios';
import DefaultLayout from '../DefaultLayout';
const { Title } = Typography;

const OnCampusJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get('http://localhost:5000/jobs');
      setJobs(res.data);
    };

    fetchJobs();
  }, []);

  const onCampusJobs = jobs.filter(job => job.campus === 'On-Compus');

  const jobsByCompany = onCampusJobs.reduce((acc, job) => {
    if (!acc[job.company]) {
      acc[job.company] = [];
    }
    acc[job.company].push(job.title);
    return acc;
  }, {});

  const jobsByCompanyArray = Object.keys(jobsByCompany).map(company => ({
    company,
    roles: jobsByCompany[company]
  }));

  const columns = [
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: roles => roles.join(', ')
    },
  ];

  return (
    <DefaultLayout>
      <div>
        <Title>Companies visited In campus placement</Title>
        <Table dataSource={jobsByCompanyArray} columns={columns} rowKey="company" />
      </div>
    </DefaultLayout>
  );
};

export default OnCampusJobs;