import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudyLevel, OpportunityCategory } from '../types';
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { loginUser, registerUser, switchUserRole } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [educationLevel, setEducationLevel] = useState<StudyLevel>('master');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('Bénin');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'login') {
      if (!email.trim()) {
        setErrorMessage('Veuillez renseigner votre adresse e-mail.');
        return;
      }
      loginUser(email.trim());
      onClose();
    } else if (mode === 'register') {
      if (!email.trim() || !displayName.trim()) {
        setErrorMessage('Veuillez renseigner votre nom complet et votre e-mail.');
        return;
      }
      registerUser({
        email: email.trim(),
        displayName: displayName.trim(),
        educationLevel,
        fieldOfStudy: fieldOfStudy.trim() || 'Sciences & Technologies',
        countryOfResidence,
        interests: ['scholarships' as OpportunityCategory],
      });
      onClose();
    } else if (mode === 'forgot') {
      if (!email.trim()) {
        setErrorMessage('Veuillez saisir votre adresse e-mail de récupération.');
        return;
      }
      setSuccessMessage('Un lien sécurisé de réinitialisation a été envoyé à cette adresse si elle existe.');
      setTimeout(() => {
        setMode('login');
        setSuccessMessage('');
      }, 3000);
    }
  };

  const handleQuickDemo = (role: 'user' | 'admin') => {
    switchUserRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {mode === 'login' && 'Connexion sécurisée'}
                {mode === 'register' && 'Créer votre compte'}
                {mode === 'forgot' && 'Réinitialiser votre mot de passe'}
              </h3>
              <p className="text-xs text-slate-500">Plateforme Opportunity Trust</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Switcher shortcuts for testing */}
        <div className="p-4 bg-blue-50/70 border-b border-blue-100">
          <span className="block text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-1.5">
            Accès rapide de démonstration & évaluation :
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo('user')}
              className="text-left p-2 rounded-lg bg-white border border-blue-200 hover:border-blue-400 text-xs transition-colors shadow-2xs"
            >
              <div className="font-bold text-slate-900 flex items-center gap-1">
                <User className="w-3 h-3 text-blue-600" />
                Candidat (Fatoumata)
              </div>
              <div className="text-[10px] text-slate-500">Étudiante Master Bénin</div>
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="text-left p-2 rounded-lg bg-white border border-blue-200 hover:border-blue-400 text-xs transition-colors shadow-2xs"
            >
              <div className="font-bold text-slate-900 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Auditeur (Dr. Sylvain)
              </div>
              <div className="text-[10px] text-slate-500">Console d'administration</div>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Nom complet *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ex: Jean-Luc Mensah"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Niveau d'études</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value as StudyLevel)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="high_school">Baccalauréat</option>
                    <option value="bachelor">Licence (Bac+3)</option>
                    <option value="master">Master (Bac+5)</option>
                    <option value="doctorate">Doctorat (PhD)</option>
                    <option value="all_levels">Autre / Ouvert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Pays de résidence</label>
                  <select
                    value={countryOfResidence}
                    onChange={(e) => setCountryOfResidence(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Bénin">Bénin</option>
                    <option value="Sénégal">Sénégal</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Togo">Togo</option>
                    <option value="France">France</option>
                    <option value="Autre pays">Autre pays</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Domaine d'études ou activité</label>
                <input
                  type="text"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="Ex : Économie, Informatique, Droit..."
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Adresse e-mail *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">Mot de passe *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            {mode === 'login' && 'Se connecter'}
            {mode === 'register' && 'Créer mon compte'}
            {mode === 'forgot' && 'Envoyer le lien de récupération'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mode Switchers */}
          <div className="text-center pt-2 text-xs text-slate-600">
            {mode === 'login' ? (
              <p>
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  S'inscrire gratuitement
                </button>
              </p>
            ) : (
              <p>
                Déjà inscrit ?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
