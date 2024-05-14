import { useState } from 'react';
import './HeartIcon.css';

const HeartIcon = ({ onClick, isActive }) => {
  const [isActiveHeart, setIsActiveHeart] = useState(isActive);

  const handleClick = () => {
    setIsActiveHeart(!isActiveHeart);
    onClick && onClick();
  };

  return (
    <div
      className={`heart${isActiveHeart ? ' is-active' : ''} `}
      onClick={handleClick}
    />
  );
};

export default HeartIcon;
