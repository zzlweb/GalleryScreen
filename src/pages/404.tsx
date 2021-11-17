import React from 'react';

export default () => {
  return (
    <div className="nothing-page flex-row">
      <img className="run-img" src={require('../../public/image/web404.svg')} />
      <div className="right-info">
        <h1>
          Oops！Error <span>404</span>…
        </h1>
        <p>We are sorry , the page you resquested cannot be found.</p>
      </div>
    </div>
  );
};
