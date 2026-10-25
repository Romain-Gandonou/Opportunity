import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Opportunity,
  Report,
  VerificationStatus,
  EditorialStatus,
  OpportunityCategory,
  StudyLevel,
  FundingType,
} from '../types';
import { VerificationBadge } from '../components/VerificationBadge';
import { CATEGORY_LABELS, FUNDING_LABELS, STUDY_LEVEL_LABELS, formatDateFr } from '../utils/formatters';
import { calculateSimilarityScore, normalizeUrl } from '../utils/opportunityLogic';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FilePlus,
  ListFilter,
  Copy,
  History,
  Lock,
  Search,
  ExternalLink,
  Save,
  Trash2,
  Check,
  XCircle,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    currentUser,
    opportunities,
    reports,
    auditEvents,
    adminCreateOpportunity,
    adminUpdateOpportunity,
    adminChangeVerification,
    adminChangeEditorialStatus,
    adminResolveReport,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'verification' | 'create' | 'reports' | 'duplicates' | 'audit'>('verification');

  // New Opportunity Form state
  const [newTitle, setNewTitle] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newCategory, setNewCategory] = useState<OpportunityCategory>('scholarships');
  const [newCountry, setNewCountry] = useState('Bénin');
  const [newDesc, setNewDesc] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newLevel, setNewLevel] = useState<StudyLevel>('master');
  const [newFunding, setNewFunding] = useState<FundingType>('full');
  const [newDeadline, setNewDeadline] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newVerification, setNewVerification] = useState<VerificationStatus>('controlled');
  const [newProof, setNewProof] = useState('Vérification du registre ministériel et absence de frais frauduleux.');
  const [formSuccess, setFormSuccess] = useState(false);

  // Verification Queue search/filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEditorial, setFilterEditorial] = useState<EditorialStatus | 'all'>('all');

  // Check admin permission
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Accès restreint à l'administration</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Cette interface requiert des privilèges d'administrateur ou d'auditeur de conformité.
          Veuillez basculer sur le rôle <strong>Admin</strong> depuis la barre supérieure pour tester.
        </p>
      </div>
    );
  }

  // Filtered opportunities for admin view
  const filteredOpps = opportunities.filter((o) => {
    if (filterEditorial !== 'all' && o.editorialStatus !== filterEditorial) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return o.title.toLowerCase().includes(q) || o.organization.toLowerCase().includes(q);
    }
    return true;
  });

  // Duplicate pairs detection
  const duplicateCandidates = useMemo(() => {
    const pairs: { opp1: Opportunity; opp2: Opportunity; score: number; urlMatch: boolean }[] = [];
    for (let i = 0; i < opportunities.length; i++) {
      for (let j = i + 1; j < opportunities.length; j++) {
        const o1 = opportunities[i];
        const o2 = opportunities[j];
        const sim = calculateSimilarityScore(o1.title, o2.title);
        const norm1 = normalizeUrl(o1.sourceUrl);
        const norm2 = normalizeUrl(o2.sourceUrl);
        const urlMatch = norm1 === norm2;
        if (sim >= 0.45 || urlMatch) {
          pairs.push({ opp1: o1, opp2: o2, score: sim, urlMatch });
        }
      }
    }
    return pairs;
  }, [opportunities]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newOrg.trim() || !newSourceUrl.trim()) return;

    adminCreateOpportunity({
      title: newTitle.trim(),
      organization: newOrg.trim(),
      category: newCategory,
      country: newCountry.trim(),
      locationType: 'on_site',
      language: 'Français',
      targetAudience: 'Étudiants et professionnels',
      description: newDesc.trim() || 'Descriptif officiel complet de l’appel.',
      summary: newSummary.trim() || newDesc.trim().slice(0, 150),
      studyLevel: newLevel,
      fundingType: newFunding,
      publicationDate: new Date().toISOString(),
      deadline: newDeadline ? `${newDeadline}T23:59:59Z` : null,
      sourceUrl: newSourceUrl.trim(),
      editorialStatus: 'published',
      verificationStatus: newVerification,
      verificationDetails: {
        methodUsed: 'Audit de source officielle par la console administrative',
        verifiedBy: currentUser.displayName,
        proofPoints: [newProof.trim()],
      },
      eligibilityCriteria: ['Critères conformes au dossier officiel'],
      sources: [
        {
          id: `src-${Date.now()}`,
          opportunityId: '',
          url: newSourceUrl.trim(),
          organizationName: newOrg.trim(),
          sourceType: 'official_site',
          lastCheckedDate: new Date().toISOString().split('T')[0],
          isOfficialDomain: true,
          notes: 'Source officielle validée lors de la publication manuelle',
          checkerId: currentUser.id,
        },
      ],
    });

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('verification');
      // Reset form
      setNewTitle('');
      setNewOrg('');
      setNewDesc('');
      setNewSummary('');
      setNewSourceUrl('');
    }, 1800);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Admin Top Header & Role Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Auditeur connecté : {currentUser.displayName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Console de Modération & d'Audit
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Garantie d'intégrité, traçabilité des sources et détection des fraudes
          </p>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'verification'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            File des annonces ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'create'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Créer une annonce
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'reports'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Signalements ({reports.filter((r) => r.status === 'pending' || r.status === 'investigating').length})
          </button>
          <button
            onClick={() => setActiveTab('duplicates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'duplicates'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Détection doublons ({duplicateCandidates.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'audit'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Journal d'audit ({auditEvents.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Verification Queue & Opportunities Management */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par titre ou organisme..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-medium">Statut éditorial :</span>
              <select
                value={filterEditorial}
                onChange={(e) => setFilterEditorial(e.target.value as EditorialStatus | 'all')}
                className="text-xs p-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="published">Publiées</option>
                <option value="suspended">Suspendues</option>
                <option value="pending_review">En vérification</option>
                <option value="draft">Brouillons</option>
                <option value="archived">Archivées</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredOpps.map((opp) => (
              <div
                key={opp.id}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        opp.editorialStatus === 'published'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : opp.editorialStatus === 'suspended'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {opp.editorialStatus}
                    </span>
                    <span className="text-xs font-semibold text-blue-700">{opp.organization}</span>
                    <span className="text-xs text-slate-400">• {opp.country}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{opp.title}</h3>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <VerificationBadge status={opp.verificationStatus} size="sm" />
                    <span>Échéance : {formatDateFr(opp.deadline)}</span>
                    <a
                      href={opp.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Source officielle
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Verification Level & Editorial Controls */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Change verification level */}
                  <select
                    value={opp.verificationStatus}
                    onChange={(e) =>
                      adminChangeVerification(
                        opp.id,
                        e.target.value as VerificationStatus,
                        'Mise à niveau manuelle depuis la console admin',
                        ['Contrôle documentaire effectué par ' + currentUser.displayName]
                      )
                    }
                    className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="unverified">1. Non vérifiée</option>
                    <option value="identified">2. Identifiée</option>
                    <option value="controlled">3. Contrôlée</option>
                    <option value="cross_checked">4. Recoupée</option>
                  </select>

                  {/* Editorial toggle */}
                  {opp.editorialStatus === 'published' ? (
                    <button
                      onClick={() =>
                        adminChangeEditorialStatus(
                          opp.id,
                          'suspended',
                          'Suspension administrative suite à réexamen'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold"
                    >
                      Suspendre
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        adminChangeEditorialStatus(
                          opp.id,
                          'published',
                          'Rétablissement de publication après conformité'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                    >
                      Publier
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Create Opportunity Form */}
      {activeTab === 'create' && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-5 max-w-3xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">Enregistrer une opportunité vérifiée</h3>
              <p className="text-xs text-slate-500">
                Chaque publication sera horodatée et attribuée à votre compte dans le journal d'audit.
              </p>
            </div>
            {formSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Annonce publiée avec succès !
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Titre de l'opportunité *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex : Bourses de Master en Énergies Renouvelables - UAC Bénin 2027"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Organisme émetteur *</label>
                <input
                  type="text"
                  required
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  placeholder="Ex : Ambassade, Ministère, Université d'Abomey-Calavi..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Pays / Zone cible *</label>
                <input
                  type="text"
                  required
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="Ex : Bénin, France, Afrique de l'Ouest..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Catégorie</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as OpportunityCategory)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Niveau d'études</label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value as StudyLevel)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  {Object.entries(STUDY_LEVEL_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Financement</label>
                <select
                  value={newFunding}
                  onChange={(e) => setNewFunding(e.target.value as FundingType)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  {Object.entries(FUNDING_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Échéance officielle (laisser vide si indéterminée)
                </label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Niveau de vérification initial</label>
                <select
                  value={newVerification}
                  onChange={(e) => setNewVerification(e.target.value as VerificationStatus)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="controlled">Source contrôlée (Niveau 3)</option>
                  <option value="cross_checked">Informations recoupées (Niveau 4)</option>
                  <option value="identified">Source identifiée (Niveau 2)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">URL de la source officielle *</label>
              <input
                type="url"
                required
                value={newSourceUrl}
                onChange={(e) => setNewSourceUrl(e.target.value)}
                placeholder="https://organisme-officiel.org/appel-candidatures"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Preuves de contrôle documentaire *</label>
              <input
                type="text"
                required
                value={newProof}
                onChange={(e) => setNewProof(e.target.value)}
                placeholder="Ex : Arrêté ministériel vérifié, absence de frais de dossier demandés"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Description & Critères *</label>
              <textarea
                rows={4}
                required
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Détail des pièces requises, profil recherché, prise en charge..."
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Publier l'annonce vérifiée
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Reports Moderation */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <strong>Protocole de signalement :</strong> Tout signalement d’escroquerie ou de frais de dossier exigés
            doit faire l'objet d'un examen immédiat. En cas de doute avéré, suspendez la publication.
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className={`p-5 rounded-xl border shadow-2xs space-y-3 ${
                  report.status === 'investigating'
                    ? 'bg-amber-50/50 border-amber-200'
                    : report.status === 'resolved'
                    ? 'bg-white border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                        report.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : report.status === 'investigating'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {report.status}
                    </span>
                    <span className="text-xs font-bold text-slate-900">Motif : {report.reason}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Signalé le {new Date(report.createdAt).toLocaleString('fr-FR')}
                  </span>
                </div>

                <p className="text-xs font-semibold text-blue-700">
                  Opportunité concernée : {report.opportunityTitle}
                </p>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                  <strong>Rapport du signaleur :</strong> {report.description}
                  {report.reporterEmail && (
                    <span className="block text-slate-400 text-[11px] mt-1">Contact : {report.reporterEmail}</span>
                  )}
                </div>

                {report.adminNotes && (
                  <div className="text-xs text-emerald-900 bg-emerald-50 p-2.5 rounded border border-emerald-200">
                    <strong>Note d'instruction admin :</strong> {report.adminNotes}
                  </div>
                )}

                {/* Moderation Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() =>
                      adminResolveReport(
                        report.id,
                        'resolved',
                        'Contrôle effectué : annonce vérifiée et corrigée'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Marquer résolu
                  </button>
                  <button
                    onClick={() =>
                      adminResolveReport(
                        report.id,
                        'investigating',
                        'En cours d’analyse avec l’organisme émetteur'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold"
                  >
                    Mettre en investigation
                  </button>
                  <button
                    onClick={() =>
                      adminResolveReport(
                        report.id,
                        'dismissed',
                        'Signalement non fondé après vérification'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                  >
                    Classer sans suite
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Duplicate Detection */}
      {activeTab === 'duplicates' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs text-slate-700 space-y-1">
            <h4 className="font-bold text-blue-900">Algorithme d'analyse de similarité de titres et d'URLs</h4>
            <p>
              Compare l'ensemble des opportunités du catalogue pour détecter les publications en doublon ou les
              variations d'intitulé d'un même appel.
            </p>
          </div>

          {duplicateCandidates.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              Aucun doublon suspect détecté sur le catalogue actuel.
            </div>
          ) : (
            <div className="space-y-3">
              {duplicateCandidates.map((pair, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Score de ressemblance : {Math.round(pair.score * 100)}%
                    </span>
                    {pair.urlMatch && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        URLs sources normalisées identiques
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-blue-700 font-bold block">{pair.opp1.organization}</span>
                      <p className="font-semibold text-slate-900">{pair.opp1.title}</p>
                      <span className="text-[11px] text-slate-500 block truncate">{pair.opp1.sourceUrl}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-blue-700 font-bold block">{pair.opp2.organization}</span>
                      <p className="font-semibold text-slate-900">{pair.opp2.title}</p>
                      <span className="text-[11px] text-slate-500 block truncate">{pair.opp2.sourceUrl}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Security Audit Events */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>
              <strong>Journalisation sécurisée :</strong> Toutes les modifications de vérification, créations et
              actions de modération sont conservées de façon immuable.
            </span>
            <span className="font-mono text-[11px] font-bold text-slate-800">{auditEvents.length} événements</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="p-3">Horodatage</th>
                    <th className="p-3">Acteur</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Ressource</th>
                    <th className="p-3">Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-mono text-[11px] text-slate-500">
                        {new Date(evt.timestamp).toLocaleString('fr-FR')}
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{evt.actor}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800">
                          {evt.action}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">{evt.resource}</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">{evt.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
