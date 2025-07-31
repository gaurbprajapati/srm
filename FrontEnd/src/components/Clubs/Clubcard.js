import React, { useEffect, useState } from "react";
import "./Clubcard.scss";

import { ClubNav } from "../../Data";
import { motion } from "framer-motion";
import Maincard from "./Maincard/Maincard";
import { useNavigate, Link } from 'react-router-dom';
import { Spin, Pagination, Button, message } from "antd";
import { clubAPI, apiUtils } from '../../utils/api';

const Clubcard = () => {
  const user = apiUtils.getCurrentUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState({ name: "all" });
  const [cdata, setCdata] = useState([]);
  const [active, setActive] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 4; // Number of Maincards per page
  const [onclickAnimation, setonclickAnimation] = useState({
    y: 0,
    opacity: 1,
  });

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await clubAPI.getClubs({
          page: currentPage,
          limit: pageSize,
          category: tab.name !== 'all' ? tab.name : undefined
        });

        if (response.success) {
          setCdata(response.data || []);
        } else {
          setCdata([]);
        }
      } catch (error) {
        console.error('Error fetching clubs:', error);
        message.error('Failed to fetch clubs');
        setCdata([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, tab.name]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size='large' />
        <p>Loading clubs...</p>
      </div>
    );
  }

  // Filter clubs based on selected tab
  const filteredClubs = tab.name === 'all'
    ? cdata
    : cdata.filter(club => club.category?.toLowerCase() === tab.name.toLowerCase());

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentClubs = filteredClubs.slice(startIndex, endIndex);

  return (
    <div>
      <div className="club-container">
        <div className="club-heading">
          <h1>
            <span className="blue">Our Campus </span>Clubs
          </h1>
          <p>
            Join clubs that match your interests and connect with like-minded students.
          </p>
        </div>

        {/* Club Navigation Tabs */}
        <div className="club-navbar">
          {ClubNav.map((list, index) => (
            <div
              key={index}
              className={`club-nav ${active === index ? "club-nav-active" : ""}`}
              onClick={() => {
                setTab({ name: list.name });
                setActive(index);
                setCurrentPage(1); // Reset to first page when changing tabs
                setonclickAnimation({ y: 100, opacity: 0 });
                setTimeout(() => {
                  setonclickAnimation({ y: 0, opacity: 1 });
                }, 200);
              }}
            >
              <h3>{list.name}</h3>
            </div>
          ))}
        </div>

        {/* Add Club Button - Only show for authenticated users */}
        {apiUtils.isAuthenticated() && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/CreateClub')}
            >
              Add New Club
            </Button>
          </div>
        )}

        {/* Clubs Grid */}
        <motion.div
          className="club-container"
          animate={onclickAnimation}
          transition={{ duration: 0.6, type: "spring" }}
        >
          {currentClubs.length > 0 ? (
            <div className="club-grid">
              {currentClubs.map((club, index) => (
                <Maincard key={club._id || index} club={club} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h3>No clubs found</h3>
              <p>
                {tab.name === 'all'
                  ? 'No clubs are currently available.'
                  : `No clubs found in the ${tab.name} category.`
                }
              </p>
              {apiUtils.isAuthenticated() && (
                <Button
                  type="primary"
                  onClick={() => navigate('/CreateClub')}
                  style={{ marginTop: '20px' }}
                >
                  Be the first to create a {tab.name !== 'all' ? tab.name : ''} club!
                </Button>
              )}
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {filteredClubs.length > pageSize && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Pagination
              current={currentPage}
              total={filteredClubs.length}
              pageSize={pageSize}
              onChange={handleChangePage}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} clubs`
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubcard;
