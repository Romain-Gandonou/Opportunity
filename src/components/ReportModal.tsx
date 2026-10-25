import React, { useState } from 'react';
import { Opportunity, ReportReason } from '../types';
import { useApp } from '../context/AppContext';
import { X, Flag, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ opportunity, onClose }) => {
  const { currentUser, submitReport } = useApp();

  const [reason, setReason] = useState<ReportReason>('fraud_suspicion');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [submitted, setSubmitted] = useState(false);

  if (!opportunity) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitReport(opportunity.id, reason, description.trim(), email.trim() || undefined);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 2200);
  };

  const reasonOptions: { value: ReportReason; label: string; desc: string }[] = [
    {
      value: 'fraud_suspicion',
      label: 'Suspicion d’arnaque ou demande d’argent illégale',
      desc: 'Un contact a exigé des frais de dossier, un versement Mobile Money ou des coordonnées bancaires.',
    },
    {
      value: 'expired_notice',
      label: 'Annonce expirée ou clôturée',
      desc: 'La date limite est dépassée ou l’organisme a annoncé la fin des dépôts.',
    },
    {
      value: 'incorrect_info',
      label: 'Information ou critère erroné',
      desc: 'Les montants, critères d’âge ou diplômes requis ne correspondent pas aux directives officielles.',
    },
    {
      value: 'broken_link',
      label: 'Lien source officiel inaccessible ou corrompu',
      desc: 'L’URL officielle renvoie une erreur 404 ou mène vers une page sans rapport.',
    },
    {
      value: 'identity_theft',
      label: 'Usurpation d’identité d’organisation',
      desc: 'L’émetteur se fait passer faussement pour une ambassade, une université ou une ONG.',
    },
    {
      value: 'duplicate',
      label: 'Doublon avec une autre annonce',
      desc: 'Cette opportunité existe déjà sous un autre intitulé sur la plateforme.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 id="report-modal-title" className="text-base font-bold text-slate-900">
                Signaler cette opportunité
              </h3>
              <p className="text-xs text-slate-500">Examen impartial et vérification par nos auditeurs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Signalement enregistré avec succès</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Votre signalement a été transmis à la cellule d’audit Opportunity Trust. Si une infraction ou une
              escroquerie est avérée, l’annonce sera immédiatement suspendue du catalogue public.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
              <span className="font-semibold text-slate-900 block truncate">{opportunity.title}</span>
              <span className="text-slate-500">{opportunity.organization}</span>
            </div>

            {/* Reason selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Motif principal du signalement *
              </label>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {reasonOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      reason === opt.value
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-medium'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={opt.value}
                      checked={reason === opt.value}
                      onChange={() => setReason(opt.value)}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="block font-semibold">{opt.label}</span>
                      <span className="text-[11px] text-slate-500 font-normal leading-tight block mt-0.5">
                        {opt.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="report-desc" className="block text-xs font-bold text-slate-800 mb-1">
                Détails et éléments constatés *
              </label>
              <textarea
                id="report-desc"
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex : Le contact prétend demander 10 000 FCFA pour envoyer le formulaire alors que la bourse officielle est déclarée gratuite..."
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email contact */}
            <div>
              <label htmlFor="report-email" className="block text-xs font-bold text-slate-800 mb-1">
                Votre adresse e-mail (facultatif, pour le suivi d'instruction)
              </label>
              <input
                id="report-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!description.trim()}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50"
              >
                Transmettre le signalement
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
