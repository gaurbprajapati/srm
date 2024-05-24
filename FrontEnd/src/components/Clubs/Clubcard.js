import React, { useEffect, useState } from "react";
import "./Clubcard.scss";

import { ClubNav } from "../../Data";
import { motion } from "framer-motion";
import Maincard from "./Maincard/Maincard";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { Spin, Pagination, Button } from "antd";
const Clubcard = () => {

  const user = JSON.parse(localStorage.getItem("sheyresume-user"));
  const navigate = useNavigate();
  const [tab, setTab] = useState({ name: "all" });
  const [cdata, setCdata] = useState([]);
  const [active, setActive] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
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
        const response = await axios.get('http://localhost:5000/clubs');
        setCdata(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!cdata) {
    return <Spin size='large' />
  }
  // useEffect(() => {
  //   setonclickAnimation({ y: 100, opacity: 0 });

  //   setTimeout(() => {
  //     setonclickAnimation({ y: 0, opacity: 1 });

  //     let filteredData = cdata;
  //     if (tab.name !== "all") {
  //       filteredData = cdata.filter(club => club.category.toLowerCase() === tab.name);
  //       console.log("data of data ", filteredData);
  //     }
  //     setCdata(filteredData);
  //   }, 1600);
  // }, [tab, cdata]);

  const filteredData = cdata.filter(club => club.category.toLowerCase() === tab.name || tab.name === "all");
  const indexOfLastClub = currentPage * pageSize;
  const indexOfFirstClub = indexOfLastClub - pageSize;
  const currentClubs = filteredData.slice(indexOfFirstClub, indexOfLastClub);

  const activeTab = (e, index) => {
    setTab({ name: e.target.textContent.toLowerCase() });
    setActive(index);
    setCurrentPage(1); // Reset page number when changing tab
  };


  return (
    <>

      {user && user.isAdmin ? <Button onClick={() => navigate('/CreateClub')} >ADD CLUBS</Button> : null}
      <div className="container" id="Clubcard">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ y: [-40, 0], opacity: 1 }}
          transition={{ duration: 1 }}
          className="title"
        >
          <span>N I E T</span>
          <h1>College Clubs</h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ y: [10, 0], opacity: 1 }}
          className="buttons"
        >
          {ClubNav.map((workNav, index) => {
            return (
              <button
                onClick={(e) => activeTab(e, index)}
                className={`${active === index ? "active" : ""}`}
                key={index}
              >
                {workNav}
              </button>
            );
          })}
        </motion.div>

        <motion.div
          // className="workImages"
          animate={onclickAnimation}
          transition={{ duration: 0.5, delayChildren: 0.5 }}
        >
          {currentClubs.length > 0 && <Maincard data={currentClubs} />}
          <Pagination
            style={{ marginTop: "20px", textAlign: "center" }}
            defaultCurrent={1}
            total={filteredData.length}
            pageSize={pageSize}
            current={currentPage}
            onChange={handleChangePage}
          />
        </motion.div>
      </div>
    </>
  );
};

export default Clubcard;

// this is past cards that are replaced with new one

{
  /* <motion.div
        animate={onclickAnimation}
        transition={{ duration: 0.5, delayChildren: 0.5 }}
        className="cluballdatas"
      >

    <motion.div
        initial={{x: 0 ,opacity: 0}}
          whileInView={{ y: [-50,0], opacity: 1 }}
        transition={{ duration: 1 }}
        exit={{opacity: 0, y: -50}}
        className="cluballdatas"

      >




       {cdata.map((work) => {
          return (
            <div className="cluballdata"
             key={work.id}
            >



             <motion.div
               whileHover={{ scale: 0.9 }}
               transition={{duration: 0.5}}
               >
            <Cards
            key={work.id}
            img={work.img}
            name={work.name}
            discription={work.discription}
            />
              </motion.div>
          </div>
            )


          })}


          </motion.div>

          </motion.div> */
}

// -----------------------------------------------------------

// addition thing to add in future ,  put up and check
// <motion.div
//   initial={{x: 0 ,opacity: 0}}
//     whileInView={{ x: [250,0], opacity: 1 }}
//     transition={{duration: 1}}
//   className="talk"
// >
//   <motion.div
//     whileHover={{ scale: 1.1 }}
//     transition={{duration: 0.3}}
//     className="talk_right"
//     >
//   <div className="talk_left">
//   so let's Explore<br />
//     <h3><span>Connect with your interested Club !</span></h3>
//   </div>
//   </motion.div>
// </motion.div>
