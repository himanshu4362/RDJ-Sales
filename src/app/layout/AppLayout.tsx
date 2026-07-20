import React from 'react';
import { Outlet } from 'react-router-dom';
import { GlobalHeader } from './GlobalHeader';
// import { MobileBottomNav } from './MobileBottomNav'; // To be implemented next

export const AppLayout: React.FC = () => {
  return (
    /* 
      bg-surface-secondary provides the baseline canvas. 
      Elevated cards inside the Outlet will use bg-surface-primary for contrast. 
    */
    <div className="flex min-h-screen flex-col bg-surface-secondary text-text-primary transition-colors duration-150">
      <GlobalHeader />
      
      {/* 
        Main content container. flex-1 allows it to push the future bottom nav 
        to the bottom of the viewport if content is short.
        Max-width ensures the layout extends the tablet experience cleanly to desktop.
      */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:px-8">
        <Outlet />
      </main>
      
      {/* <MobileBottomNav /> */}
    </div>
  );
};