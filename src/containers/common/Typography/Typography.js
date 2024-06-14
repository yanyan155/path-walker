import React from 'react';
import PropTypes from 'prop-types';

const Typography = ({ tag, children, ...otherProps }) => {
  const Tag = tag;
  return <Tag {...otherProps}>{children}</Tag>;
};

Typography.propTypes = {
  tag: PropTypes.string.isRequired,
  otherProps: PropTypes.any,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Typography;
