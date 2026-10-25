import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Opportunity, FilterState, OpportunityCategory, StudyLevel, FundingType, VerificationStatus } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { filterOpportunities } from '../utils/opportunityLogic';
import { CATEGORY_LABELS, FUNDING_LABELS, STUDY_LEVEL_LABELS } from '../utils/formatters';
import {
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface CatalogueViewProps {
  initialCategory?: string;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onOpenReport: (opportunity: Opportunity) => void;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  initialCategory,
  onSelectOpportunity,
  onOpenReport,
}) => {
  const { opportunities } = useApp();

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: (initialCategory as OpportunityCategory) || 'all',
    country: 'all',
    studyLevel: 'all',
    fundingType: 'all',
    verificationStatus: 'all',
    hideExpired: true,
    sortBy: 'recent',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Extract unique countries
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((o) => {
      if (o.country) set.add(o.country);
    });
    return Array.from(set).sort();
  }, [opportunities]);

  // Filtered and sorted list
  const filteredList = useMemo(() => {
    return filterOpportunities(opportunities, filters);
  }, [opportunities, filters]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      country: 'all',
      studyLevel: 'all',
      fundingType: 'all',
      verificationStatus: 'all',
      hideExpired: false,
      sortBy: 'recent',
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Catalogue des opportunités
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {filteredList.length} opportunité(s) vérifiée(s) et publiée(s) répondant à vos critères
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Mobile Filter Drawer trigger */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="sm:hidden flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres ({filteredList.length})
          </button>

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Opportunities Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div
          className={`${
            mobileFilterOpen ? 'block' : 'hidden'
          } lg:block lg:col-span-1 space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs h-fit`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              Filtrer les annonces
            </h2>
            <span className="text-[11px] text-slate-500">{filteredList.length} résultat(s)</span>
          </div>

          {/* Search keyword input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Mots-clés</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => {
                  setFilters({ ...filters, searchQuery: e.target.value });
                  setCurrentPage(1);
                }}
                placeholder="Titre, organisme, pays..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Catégorie</label>
            <select
              value={filters.category}
              onChange={(e) => {
                setFilters({ ...filters, category: e.target.value as OpportunityCategory | 'all' });
                setCurrentPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Pays / Zone</label>
            <select
              value={filters.country}
              onChange={(e) => {
                setFilters({ ...filters, country: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les pays / zones</option>
              {availableCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Study Level */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Niveau d'études</label>
            <select
              value={filters.studyLevel}
              onChange={(e) => {
                setFilters({ ...filters, studyLevel: e.target.value as StudyLevel | 'all' });
                setCurrentPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous niveaux</option>
              {Object.entries(STUDY_LEVEL_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Funding Type */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Type de financement</label>
            <select
              value={filters.fundingType}
              onChange={(e) => {
                setFilters({ ...filters, fundingType: e.target.value as FundingType | 'all' });
                setCurrentPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous financements</option>
              {Object.entries(FUNDING_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Niveau de vérification</label>
            <select
              value={filters.verificationStatus}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  verificationStatus: e.target.value as VerificationStatus | 'all',
                });
                setCurrentPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous niveaux de vérification</option>
              <option value="cross_checked">Informations recoupées (Niveau 4)</option>
              <option value="controlled">Source contrôlée (Niveau 3)</option>
              <option value="identified">Source identifiée (Niveau 2)</option>
              <option value="unverified">Source non vérifiée (Niveau 1)</option>
            </select>
          </div>

          {/* Hide Expired Checkbox */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={filters.hideExpired}
                onChange={(e) => {
                  setFilters({ ...filters, hideExpired: e.target.checked });
                  setCurrentPage(1);
                }}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Masquer les opportunités expirées</span>
            </label>
          </div>

          {/* Sort selector */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 mb-1">Trier par</label>
            <select
              value={filters.sortBy}
              onChange={(e) => {
                setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] });
                setCurrentPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Publication la plus récente</option>
              <option value="deadline_asc">Échéance la plus proche</option>
              <option value="trust_desc">Niveau de confiance / Recoupement</option>
            </select>
          </div>
        </div>

        {/* Opportunity Cards List */}
        <div className="lg:col-span-3 space-y-6">
          {paginatedList.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Aucune opportunité trouvée</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Aucune annonce ne correspond exactement à vos critères actuels. Essayez d'élargir la recherche ou de
                réinitialiser vos filtres.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {paginatedList.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    onSelect={onSelectOpportunity}
                    onOpenReport={onOpenReport}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs">
                  <span className="text-slate-500">
                    Page <strong className="text-slate-800">{currentPage}</strong> sur{' '}
                    <strong className="text-slate-800">{totalPages}</strong> ({filteredList.length} au total)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
