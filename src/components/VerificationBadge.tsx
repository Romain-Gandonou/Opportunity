import React from 'react';
import { VerificationStatus } from '../types';
import { ShieldCheck, ShieldAlert, CheckCircle2, Link2, Info } from 'lucide-react';

interface VerificationBadgeProps {
  status: VerificationStatus;
  showDetails?: boolean;
  lastVerifiedDate?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  showDetails = false,
  lastVerifiedDate,
  size = 'md',
}) => {
  const config = {
    cross_checked: {
      label: 'Informations recoupées',
      shortLabel: 'Recoupée',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-500/20',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      description: 'Annonce confrontée à au moins 2 sources officielles et documents d’accréditation vérifiés.',
    },
    controlled: {
      label: 'Source contrôlée',
      shortLabel: 'Contrôlée',
      color: 'bg-blue-50 text-blue-800 border-blue-200 ring-blue-500/20',
      icon: ShieldCheck,
      iconColor: 'text-blue-600',
      description: 'Éléments de contrôle documentés, domaine institutionnel et contact de référence validés.',
    },
    identified: {
      label: 'Source identifiée',
      shortLabel: 'Identifiée',
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200 ring-indigo-500/20',
      icon: Link2,
      iconColor: 'text-indigo-600',
      description: 'Lien d’origine et émetteur apparent enregistrés, en attente d’audit approfondi.',
    },
    unverified: {
      label: 'Source non vérifiée',
      shortLabel: 'Non vérifiée',
      color: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/20',
      icon: ShieldAlert,
      iconColor: 'text-amber-600',
      description: 'Provenance insuffisamment contrôlée. Vigilance renforcée recommandée.',
    },
  }[status];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <span
        title={config.description}
        className={`inline-flex items-center rounded-md border ring-1 ring-inset ${config.color} ${sizeClasses}`}
      >
        <Icon className={`w-3.5 h-3.5 shrink-0 ${config.iconColor}`} />
        <span>{size === 'sm' ? config.shortLabel : config.label}</span>
      </span>

      {showDetails && (
        <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
          <Info className="w-3 h-3 text-gray-400 shrink-0" />
          <span>
            {lastVerifiedDate
              ? `Vérifié le ${new Date(lastVerifiedDate).toLocaleDateString('fr-FR')}`
              : 'Date de contrôle enregistrée'}
          </span>
        </div>
      )}
    </div>
  );
};
