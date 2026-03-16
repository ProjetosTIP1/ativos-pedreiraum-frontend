import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className={styles.mainContent}>
        {children}
      </main>
      <Footer />
    </>
  );
};
