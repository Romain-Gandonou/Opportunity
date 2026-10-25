import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Opportunity } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { CATEGORY_LABELS } from '../utils/formatters';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertOctagon,
  ExternalLink,
  BookOpen,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Building,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string, categoryFilter?: string) => void;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onOpenReport: (opportunity: Opportunity) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectOpportunity,
  onOpenReport,
}) => {
  const { opportunities } = useApp();
  const [quickSearch, setQuickSearch] = useState('');

  const featuredOpportunities = opportunities
    .filter((o) => o.editorialStatus === 'published' && o.isFeatured)
    .slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('catalogue');
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-blue-900 via-slate-900 to-slate-950 text-white px-6 py-16 sm:px-12 sm:py-20 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Plateforme internationale certifiée — Bénin & Afrique francophone</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Des opportunités réelles. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 via-cyan-200 to-emerald-300">
              Des sources 100% vérifiées.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Fini les annonces périmées, les fausses bourses et les demandes illégales de Mobile Money.
            Opportunity Trust audite chaque appel d'offres, bourse d'excellence, stage et financement avant publication.
          </p>

          {/* Quick Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Rechercher par mot-clé (ex: Master, Informatique, Bourse Eiffel, Cotonou...)"
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Explorer le catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Categories shortcut pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 text-xs font-medium">Catégories directes :</span>
            <button
              onClick={() => onNavigate('catalogue', 'scholarships')}
              className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-blue-600/30 border border-slate-700 text-slate-200 text-xs transition-colors"
            >
              Bourses d'excellence
            </button>
            <button
              onClick={() => onNavigate('catalogue', 'internships')}
              className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-blue-600/30 border border-slate-700 text-slate-200 text-xs transition-colors"
            >
              Stages & Recrutements
            </button>
            <button
              onClick={() => onNavigate('catalogue', 'grants')}
              className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-blue-600/30 border border-slate-700 text-slate-200 text-xs transition-colors"
            >
              Financements TEF & Startups
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Numbers */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700">100%</div>
          <div className="text-xs font-bold text-slate-900">Sources Officielles</div>
          <div className="text-[11px] text-slate-500">Traçabilité ministérielle et institutionnelle</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">4 Niveaux</div>
          <div className="text-xs font-bold text-slate-900">Protocole de Contrôle</div>
          <div className="text-[11px] text-slate-500">Du premier lien au recoupement complet</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-700">0 FCFA</div>
          <div className="text-xs font-bold text-slate-900">Frais d'accès</div>
          <div className="text-[11px] text-slate-500">Information libre pour tous les candidats</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">100%</div>
          <div className="text-xs font-bold text-slate-900">Anti-Arnaque</div>
          <div className="text-[11px] text-slate-500">Signalements traités sous 24h</div>
        </div>
      </section>

      {/* Featured Verified Opportunities */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Sélection rigoureuse
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Opportunités vérifiées du moment
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalogue')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline"
          >
            Voir tout le catalogue ({opportunities.filter((o) => o.editorialStatus === 'published').length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onSelect={onSelectOpportunity}
              onOpenReport={onOpenReport}
            />
          ))}
        </div>
      </section>

      {/* Verification Methodology Breakdown */}
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-12 space-y-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
            Notre garantie éditoriale
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900">
            Comment Opportunity Trust vérifie chaque opportunité ?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Contrairement aux réseaux sociaux où circulent de faux avis de recrutement exigeant des versements d'argent,
            notre équipe applique une grille d'audit en 4 étapes strictes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-block">
              Niveau 1
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Source non vérifiée</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Annonce collectée mais non encore instruite. Maintenue en file d'attente fermée ou étiquetée avec prudence.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 inline-block">
              Niveau 2
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Source identifiée</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              L'émetteur apparent et l'URL source sont enregistrés et archivés dans nos registres d'audit.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 inline-block">
              Niveau 3
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Source contrôlée</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vérification des certificats de domaine, absence de frais illégaux et confirmation des contacts officiels.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
              Niveau 4
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Informations recoupées</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Confrontation à au moins deux sources indépendantes (arrêté officiel, portail diplomatique, presse institutionnelle).
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('methodology')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline"
          >
            En savoir plus sur notre charte de vérification
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Scam Prevention Callout Box */}
      <section className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-rose-800 text-xs font-bold">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span>Vigilance Citoyenne & Prévention des Arnaques</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Une offre vous demande de l'argent par Mobile Money ?
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Les bourses d'État et programmes légitimes (Bénin DBSU, Campus France, UNICEF, Tony Elumelu, DAAD...)
            <strong> n'exigent jamais de transfert Mobile Money ou de virement par un intermédiaire privé</strong> pour
            déposer un dossier.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={() => onNavigate('scam-prevention')}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            Guide Anti-Arnaque & Signaux
          </button>
        </div>
      </section>
    </div>
  );
};
