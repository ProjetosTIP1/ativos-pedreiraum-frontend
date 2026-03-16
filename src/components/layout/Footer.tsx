import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import logo from "../../assets/logos/logo.png";
import style from "./Footer.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={style.footer}>
      <div className={style.container}>
        <div className={style.grid}>
          {/* Brand */}
          <div className={style.brandSection}>
            <div className={style.brandLogo}>
              <div className={style.brandIcon}>
                <img
                  className={style.brandIconImage}
                  src={logo}
                  alt="Pedreira Um Valemix Logo"
                />
              </div>
              <span className={style.brandName}>
                PEDREIRA UM VALEMIX ATIVOS
              </span>
            </div>
            <p className={style.brandDesc}>
              Portal de comercialização de ativos usados do Grupo Pedreira Um
              Valemix. Equipamentos de alta performance, revisados e prontos
              para operação.
            </p>
            <div className={style.socialLinks}>
              <a
                href={import.meta.env.VITE_COMPANY_WEBSITE}
                target="_blank"
                rel="noreferrer"
                className={style.socialLink}
              >
                <ExternalLink size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={style.sectionTitle}>Navegação</h4>
            <ul className={style.linkList}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/ativos">Catálogo</Link>
              </li>
              <li>
                <Link to="/login">Administração</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={style.sectionTitle}>Contato</h4>
            <ul className={style.contactList}>
              <li className={style.contactItem}>
                <MapPin size={18} className={style.contactIcon} />
                <span>{import.meta.env.VITE_COMPANY_ADDRESS}</span>
              </li>
              <li className={style.contactItemCentered}>
                <Phone size={18} className={style.contactIcon} />
                <span>{import.meta.env.VITE_COMPANY_PHONE}</span>
              </li>
              <li className={style.contactItemCentered}>
                <Mail size={18} className={style.contactIcon} />
                <span>{import.meta.env.VITE_COMPANY_EMAIL}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={style.bottomBar}>
          <p>
            © {new Date().getFullYear()} GRUPO PEDREIRA UM VALEMIX. TODOS OS
            DIREITOS RESERVADOS.
          </p>
          <p className={style.bottomBarText}>
            Desenvolvido com Foco em Performance
          </p>
        </div>
      </div>
    </footer>
  );
};
