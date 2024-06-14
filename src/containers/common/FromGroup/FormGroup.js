import React from 'react';
import PropTypes from 'prop-types';

const FormGroup = ({ id, labelText, tag, ...otherProps }) => {
  const Tag = tag;
  return (
    <div className="form-group">
      <label htmlFor={id}>{labelText}</label>
      <Tag id={id} {...otherProps} />
    </div>
  );
};

FormGroup.propTypes = {
  id: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  otherProps: PropTypes.any,
};

export default FormGroup;
