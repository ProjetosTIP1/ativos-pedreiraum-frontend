import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-[var(--color-industrial-orange)] flex items-center justify-center font-black text-black">
                V
              </div>
              <span className="font-black text-xl tracking-tighter">VALEMIX ATIVOS</span>
            </div>
            <p className="text-[var(--color-text-dim)] text-sm mb-6 max-w-md">
              Portal de comercialização de ativos usados do Grupo Pedreira Um Valemix. 
              Equipamentos de alta performance, revisados e prontos para operação.
            </p>
            <div className="flex space-x-4">
                <a href="https://valemix.com.br" target="_blank" rel="noreferrer" className="text-[var(--color-text-dim)] hover:text-[var(--color-industrial-orange)] transition-colors">
                    <ExternalLink size={20} />
                </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-industrial-orange)] mb-6">Navegação</h4>
            <ul className="space-y-3 text-sm font-bold uppercase tracking-widest italic">
              <li><Link to="/" className="hover:text-[var(--color-industrial-orange)] transition-colors">Home</Link></li>
              <li><Link to="/ativos" className="hover:text-[var(--color-industrial-orange)] transition-colors">Catálogo</Link></li>
              <li><Link to="/login" className="hover:text-[var(--color-industrial-orange)] transition-colors">Administração</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-industrial-orange)] mb-6">Contato</h4>
            <ul className="space-y-4 text-sm text-[var(--color-text-dim)]">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 text-[var(--color-industrial-orange)] flex-shrink-0" />
                <span>Belo Horizonte, MG - Brasil</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-[var(--color-industrial-orange)] flex-shrink-0" />
                <span>(31) 9XXXX-XXXX</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-[var(--color-industrial-orange)] flex-shrink-0" />
                <span>contato@valemix.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-dim)]">
          <p>© {new Date().getFullYear()} GRUPO PEDREIRA UM VALEMIX. TODOS OS DIREITOS RESERVADOS.</p>
          <p className="mt-2 md:mt-0">Desenvolvido com Foco em Performance</p>
        </div>
      </div>
    </footer>
  );
};
