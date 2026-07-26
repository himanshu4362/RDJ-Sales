import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppRouter } from './app/AppRouter'; 

const App: React.FC = () => {
  return <RouterProvider router={AppRouter} />;
};

export default App;