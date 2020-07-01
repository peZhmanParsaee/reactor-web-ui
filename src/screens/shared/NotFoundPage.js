import React from 'react';
import { Link } from 'react-router';
import { pure } from 'recompose';

const NotFoundPage = () => (
  <div>
    404 - <Link to="/">Go Home</Link>
  </div>
);

export default pure(NotFoundPage);
