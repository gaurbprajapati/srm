import React from "react";
import { motion } from "framer-motion";
import "./Maincard.scss";
import { Link } from "react-router-dom";
import { FiGithub, FiEye } from "react-icons/fi"
import { Spin } from "antd";

function Maincard(props) {

  if (!props.data) {
    return <Spin size='large' />
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ y: [40, 0], opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="body_main">
        {props.data?.map((dataval, index) => (
          <>
            <Link className="links" to={`/club/${dataval._id}`}>
              <motion.div
                whileInView={{ opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5, type: "tween" }}
                className="body_inner"
                key={index}
              >
                <img src={require(`../../../images/${dataval.cover}`)} alt={dataval.title} />
                <h2 className="bold-text" style={{ marginTop: 20 }}>
                  {dataval.title}
                </h2>
                <p className="p-text" style={{ marginTop: 10 }}>
                  {dataval.discription}
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: [0, 1] }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className='hoverLayer'
                >
                  <motion.a href='#'
                    whileInView={{ scale: [0, 1] }}
                    whileHover={{ scale: [1, 1.1] }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiGithub />
                  </motion.a>

                  <motion.a href='#'
                    whileInView={{ scale: [0, 1] }}
                    whileHover={{ scale: [1, 1.1] }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiEye />
                  </motion.a>

                </motion.div>

              </motion.div>
            </Link>
          </>
        ))}
      </div>
    </motion.div>
  );
}

export default Maincard;
