import React from 'react';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for might be in another universe.</p>
      {/* You can add a link to navigate back to the home page or another page */}
      <p>
        <a href="/homepage">Go to Home Page</a>
      </p>
    </div>
  );
};

export default NotFoundPage;
