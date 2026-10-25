import React from 'react';
import { Opportunity } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { CATEGORY_LABELS, FUNDING_LABELS, formatDateFr } from '../utils/formatters';
import { calculateDaysRemaining, isOpportunityExpired } from '../utils/opportunityLogic';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  MapPin,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Clock,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opportunity: Opportunity) => void;
  onOpenReport?: (opportunity: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSelect,
}) => {
  const { isFavorite, toggleFavorite, getUserApplicationForOpportunity } = useApp();
  const favorite = isFavorite(opportunity.id);
  const userApplication = getUserApplicationForOpportunity(opportunity.id);

  const daysLeft = calculateDaysRemaining(opportunity.deadline);
  const isExpired = isOpportunityExpired(opportunity.deadline);

  return (
    <div
      className={`group relative flex flex-col rounded-xl border bg-white p-5 transition-all duration-200 hover:shadow-md hover:border-blue-300 ${
        isExpired ? 'opacity-75 bg-slate-50/70 border-slate-200' : 'border-slate-200 shadow-xs'
      }`}
    >
      {/* Top row: Category, Funding & Favorite button */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center text-[11px] font-semibold text-slate-700 bg-slate-100 rounded-md px-2 py-0.5">
            {CATEGORY_LABELS[opportunity.category] || opportunity.category}
          </span>
          <span className="inline-flex items-center text-[11px] font-medium text-emerald-800 bg-emerald-50 rounded-md px-2 py-0.5 border border-emerald-100">
            {FUNDING_LABELS[opportunity.fundingType]}
          </span>
          {opportunity.isFeatured && (
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 rounded-md px-1.5 py-0.5 border border-amber-200">
              À la une
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(opportunity.id);
          }}
          aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          title={favorite ? 'Retirer des favoris' : 'Enregistrer en favoris'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          {favorite ? (
            <BookmarkCheck className="w-5 h-5 text-blue-600 fill-blue-100" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Organization and Title */}
      <div className="mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1 line-clamp-1">
          {opportunity.organization}
        </p>
        <h3
          onClick={() => onSelect(opportunity)}
          className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
        >
          {opportunity.title}
        </h3>
      </div>

      {/* Short description */}
      <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
        {opportunity.summary || opportunity.description}
      </p>

      {/* Metadata Badges (Country, Level, Verification) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mb-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate font-medium">{opportunity.country}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">Niveau : {opportunity.studyLevel}</span>
        </div>
      </div>

      {/* Verification Level & Expiry Footer */}
      <div className="mt-auto pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <VerificationBadge status={opportunity.verificationStatus} size="sm" />

        {isExpired ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <AlertTriangle className="w-3 h-3" />
            Échéance expirée
          </span>
        ) : daysLeft !== null ? (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border ${
              daysLeft <= 7
                ? 'text-amber-800 bg-amber-50 border-amber-200'
                : 'text-slate-600 bg-slate-50 border-slate-200'
            }`}
          >
            <Clock className="w-3 h-3 text-slate-400" />
            {daysLeft === 0 ? 'Dernier jour !' : daysLeft === 1 ? 'Demain' : `${daysLeft} jours restants`}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
            <Calendar className="w-3 h-3" />
            Dépôt permanent
          </span>
        )}
      </div>

      {/* Card Action footer */}
      <div className="mt-3 pt-2 flex items-center justify-between gap-2">
        {userApplication ? (
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Suivi actif : {userApplication.status}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">
            Mis à jour le {formatDateFr(opportunity.lastVerifiedDate)}
          </span>
        )}

        <button
          onClick={() => onSelect(opportunity)}
          className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-md hover:bg-blue-50"
        >
          Détails & Éligibilité
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
