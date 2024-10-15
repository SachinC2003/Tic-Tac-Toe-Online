/*import React from 'react';

const circleSvg = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </g>
  </svg>
);

const crossSvg = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M19 5L5 19M5.00001 5L19 19"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </g>
  </svg>
);

export function Square({ id, gameStatus, currentPlayer, finishState, finishStateArray, onClick }) {
  const value = gameStatus[Math.floor(id / 3)][id % 3];
  const isWinningSquare = Array.isArray(finishStateArray) && finishStateArray.includes(id);

  const getIcon = () => {
    if (value === 'circle') return circleSvg;
    if (value === 'cross') return crossSvg;
    return null;
  };

  return (
    <div 
      onClick={() => !finishState && onClick(id)}
      className={`box w-24 h-24 flex items-center justify-center ${isWinningSquare ? 'bg-red-500' : 'bg-gray-700'}`}
    >
      {getIcon()}
    </div>
  );
}*/
import React from 'react';

const circleSvg = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </g>
  </svg>
);

const crossSvg = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M19 5L5 19M5.00001 5L19 19"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </g>
  </svg>
);

export function Square({ id, gameStatus, currentPlayer, finishState, finishStateArray, onClick, disabled }) {
  const value = gameStatus[Math.floor(id / 3)][id % 3];
  const isWinningSquare = Array.isArray(finishStateArray) && finishStateArray.includes(id);

  const getIcon = () => {
    if (value === 'circle') return circleSvg;
    if (value === 'cross') return crossSvg;
    return null;
  };

  return (
    <div 
      onClick={() => !disabled && !finishState && onClick(id)}
      className={`box w-24 h-24 flex items-center justify-center ${isWinningSquare ? 'bg-red-500' : 'bg-gray-700'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {getIcon()}
    </div>
  );
}