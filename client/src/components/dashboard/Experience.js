import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteExperience } from "../../actions/profile";

const Experience = ({ experience, deleteExperience }) => {
  const experiences = experience.map(xp => (
    <tr key={xp._id}>
      <td>{xp.company}</td>
      <td className="hide-sm">{xp.title}</td>
      <td>
        <Moment format="YYYY/MM/DD" date={xp.from} /> -{" "}
        {xp.to === null ? "Now" : <Moment format="YYYY/MM/DD" date={xp.to} />}
      </td>
      <td>
        <button
          onClick={() => deleteExperience(xp._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className="my-2">Experience Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired
};

export default connect(null, { deleteExperience })(Experience);
