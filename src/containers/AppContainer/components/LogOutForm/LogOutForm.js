import React from 'react';
import PropTypes from 'prop-types';

const LogOutForm = ({ logOutFormRef }) => {
  return (
    <form
      id="logout-form"
      action="/logout"
      method="post"
      className="opacity-0"
      ref={logOutFormRef}
    ></form>
  );
};

LogOutForm.propTypes = {
  logOutFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
};

export default LogOutForm;
