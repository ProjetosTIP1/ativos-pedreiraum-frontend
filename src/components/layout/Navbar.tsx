import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { Button } from '../ui/Button';
import { LogIn, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              V
            </div>
            <div className={styles.logoTextContainer}>
              <span className={styles.logoTitle}>VALEMIX</span>
              <span className={styles.logoSubtitle}>Catálogo de Ativos</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className={styles.desktopNav}>
            <Link to="/ativos" className={styles.navLink}>
              Catálogo
            </Link>
            
            {isAuthenticated ? (
              <div className={styles.authSection}>
                <Link to="/admin" className={styles.adminLink}>
                  <LayoutDashboard size={14} className={styles.iconMargin} />
                  Painel Admin
                </Link>
                <div className={styles.divider}></div>
                <button onClick={logout} className={styles.logoutButton}>
                  <LogOut size={14} className={styles.iconMargin} />
                  Sair
                </button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="flex items-center">
                <LogIn size={14} className={styles.iconMargin} />
                ACESSAR ADMIN
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className={styles.mobileMenuButton}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={styles.menuIconTrigger}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link 
            to="/ativos" 
            className={styles.mobileNavLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Catálogo
          </Link>
          {isAuthenticated ? (
            <>
              <Link 
                to="/admin" 
                className={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Painel Admin
              </Link>
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className={styles.mobileLogoutButton}>
                Sair
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Acessar Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
