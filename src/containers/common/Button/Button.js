import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ type, text, extraClasses, onClick }) => {
  const className = `btn btn-primary ${extraClasses ? extraClasses : ''}`;
  const click = onClick ? onClick : null;
  return (
    <button onClick={click} type={type} className={className}>
      {text}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  extraClasses: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
