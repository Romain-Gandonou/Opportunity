import React from 'react';
import { ShieldCheck, Lock, ExternalLink, Mail, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-white">
                Opportunity<span className="text-blue-400">Trust</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plateforme internationale de découverte, de vérification et de gestion des opportunités académiques et
              professionnelles. Conçue pour mettre fin aux annonces douteuses et frauduleuses.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Cotonou, Bénin — Rayonnement Afrique & Monde</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Plateforme</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('catalogue')}
                  className="hover:text-white transition-colors"
                >
                  Catalogue des opportunités
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('methodology')}
                  className="hover:text-white transition-colors"
                >
                  Méthode de vérification
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('scam-prevention')}
                  className="hover:text-white transition-colors"
                >
                  Prévention des arnaques
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  À propos d'Opportunity Trust
                </button>
              </li>
            </ul>
          </div>

          {/* Aide & Conformité */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Sécurité & Aide</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('help')}
                  className="hover:text-white transition-colors"
                >
                  Centre d'aide & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Formulaire de contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Politique de confidentialité
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors"
                >
                  Conditions d'utilisation
                </button>
              </li>
            </ul>
          </div>

          {/* Charte de Transparence */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Engagement de confiance</h4>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Zéro frais d'intermédiation</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Chaque publication fait l'objet d'un contrôle de source. Aucune annonce n'est publiée sans provenance
                identifiée.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Conforme Code du Numérique du Bénin & RGPD</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Opportunity Trust. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-300">
              Données personnelles & Export
            </button>
            <button onClick={() => onNavigate('terms')} className="hover:text-slate-300">
              Mentions légales
            </button>
            <button onClick={() => onNavigate('scam-prevention')} className="text-rose-400 hover:text-rose-300">
              Signaler une fraude
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
