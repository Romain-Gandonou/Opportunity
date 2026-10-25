import React, { useState } from 'react';
import { Opportunity } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { CATEGORY_LABELS, FUNDING_LABELS, STUDY_LEVEL_LABELS, formatDateFr } from '../utils/formatters';
import { calculateDaysRemaining, isOpportunityExpired, calculateEligibilityScore } from '../utils/opportunityLogic';
import { useApp } from '../context/AppContext';
import {
  X,
  Building2,
  Calendar,
  Globe2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Sparkles,
  FileText,
  Flag,
  Copy,
  Check,
  Info,
} from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onOpenReport: (opportunity: Opportunity) => void;
  onOpenAuth: () => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  onClose,
  onOpenReport,
  onOpenAuth,
}) => {
  const {
    currentUser,
    isFavorite,
    toggleFavorite,
    getUserApplicationForOpportunity,
    createApplication,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'details' | 'eligibility' | 'sources' | 'letter'>('details');
  const [copiedLetter, setCopiedLetter] = useState(false);

  if (!opportunity) return null;

  const favorite = isFavorite(opportunity.id);
  const application = getUserApplicationForOpportunity(opportunity.id);
  const daysLeft = calculateDaysRemaining(opportunity.deadline);
  const isExpired = isOpportunityExpired(opportunity.deadline);

  // Compute eligibility match if user is logged in
  const eligibility = calculateEligibilityScore(currentUser || {}, opportunity);

  // Cover letter generator template based on verified facts
  const generatedCoverLetter = `Objet : Candidature au programme "${opportunity.title}"

Madame, Monsieur les membres du comité de sélection de ${opportunity.organization},

Actuellement ${currentUser?.educationLevel ? STUDY_LEVEL_LABELS[currentUser.educationLevel] : 'étudiant(e)'} en ${currentUser?.fieldOfStudy || 'sciences et technologies'}, je vous adresse par la présente ma candidature avec le plus vif intérêt.

En prenant connaissance des conditions publiées sur votre canal officiel (${opportunity.sourceUrl}), j’ai constaté une parfaite adéquation entre mes aspirations académiques et les exigences de votre appel. En effet, mon parcours m’a permis de développer des compétences solides en ${currentUser?.skills?.slice(0, 3).join(', ') || 'recherche et analyse'}.

Votre initiative constitue une opportunité d’excellence pour consolider mon impact au service du développement durable et de l'innovation.

Je me tiens à votre entière disposition pour tout entretien ou pièce complémentaire, et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${currentUser?.displayName || '[Votre Nom et Prénom]'}`;

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(generatedCoverLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2500);
  };

  const handleTrackApplication = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!application) {
      createApplication(opportunity.id, 'to_prepare');
    }
    setActiveTab('details');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 bg-slate-50/50">
          <div className="pr-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-2 py-0.5">
                {CATEGORY_LABELS[opportunity.category]}
              </span>
              <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-0.5">
                {FUNDING_LABELS[opportunity.fundingType]}
              </span>
              <VerificationBadge status={opportunity.verificationStatus} size="sm" />
            </div>
            <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {opportunity.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-medium text-slate-800">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {opportunity.organization}
              </span>
              <span className="flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                {opportunity.country}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Dernière vérification : {formatDateFr(opportunity.lastVerifiedDate)}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer la modal"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Expiry Warning Banner if passed */}
        {isExpired && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center gap-3 text-rose-800 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Attention :</strong> L'échéance de cette opportunité ({formatDateFr(opportunity.deadline)}) est
              dépassée. Nous vous invitons à consulter le site officiel pour connaître les prochaines sessions.
            </span>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Présentation & Critères
          </button>
          <button
            onClick={() => setActiveTab('eligibility')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'eligibility'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Analyse d'Éligibilité ({eligibility.percentageMatch}%)
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'sources'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Contrôle & Traçabilité
          </button>
          <button
            onClick={() => setActiveTab('letter')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'letter'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4 text-purple-600" />
            Aide à la candidature
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Summary card */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-sm text-slate-800 leading-relaxed">
                <h4 className="font-semibold text-blue-900 mb-1 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  En résumé
                </h4>
                <p>{opportunity.summary || opportunity.description}</p>
              </div>

              {/* Full Description */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Description détaillée</h4>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {opportunity.description}
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Critères d'éligibilité confirmés
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {opportunity.eligibilityCriteria.map((criterion, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-800"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0 border border-emerald-200 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{criterion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Source & Anti-Fraud Notice */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 space-y-1">
                    <p className="font-bold text-slate-900">
                      Règle absolue de sécurité Opportunity Trust
                    </p>
                    <p>
                      Opportunity Trust référence les démarches officielles mais n'intervient jamais comme intermédiaire
                      financier. <strong>Ne versez jamais d’argent par Mobile Money</strong> à un prétendu agent ou
                      intermédiaire pour une bourse ou un emploi.
                    </p>
                    <div className="pt-2">
                      <a
                        href={opportunity.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                      >
                        Consulter l'annonce sur le site officiel de l'organisme ({opportunity.organization})
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div className="space-y-6">
              {/* Score header */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Compatibilité estimée de votre profil : {eligibility.percentageMatch}%
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Évaluation déterministe basée sur votre niveau d'études, vos langues, votre pays de résidence et vos
                    intérêts.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-600 flex items-center justify-center bg-white shadow-xs">
                    <span className="text-sm font-extrabold text-blue-700">{eligibility.percentageMatch}%</span>
                  </div>
                </div>
              </div>

              {/* Matching Criteria */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Points forts de votre profil ({eligibility.matchingCriteria.length})
                </h5>
                <div className="space-y-1.5">
                  {eligibility.matchingCriteria.map((c, i) => (
                    <div key={i} className="text-xs p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Criteria or Points of Attention */}
              {eligibility.missingCriteria.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Points d'attention à vérifier ({eligibility.missingCriteria.length})
                  </h5>
                  <div className="space-y-1.5">
                    {eligibility.missingCriteria.map((c, i) => (
                      <div key={i} className="text-xs p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable recommendations */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Recommandations avant soumission
                </h5>
                <ul className="text-xs space-y-1 text-slate-600 list-disc pl-5">
                  <li>Téléchargez toujours le dossier de candidature depuis le portail officiel de l'organisme.</li>
                  <li>Faites certifier vos diplômes et relevés de notes auprès des autorités compétentes.</li>
                  <li>Anticipez la demande de lettres de recommandation au moins 3 semaines à l'avance.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Audit de traçabilité Opportunity Trust
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Niveau de vérification :</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {opportunity.verificationStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Audité par :</span>
                    <span className="font-semibold text-slate-800">
                      {opportunity.verificationDetails?.verifiedBy || 'Cellule de vérification Opportunity Trust'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date de dernier contrôle :</span>
                    <span className="font-semibold text-slate-800">
                      {formatDateFr(opportunity.lastVerifiedDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Contact officiel répertorié :</span>
                    <span className="font-semibold text-slate-800">
                      {opportunity.verificationDetails?.officialContactProvided || 'Référencé dans l’appel officiel'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Method explanation */}
              <div>
                <h5 className="text-xs font-bold text-slate-900 mb-1">Méthode de contrôle employée</h5>
                <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                  {opportunity.verificationDetails?.methodUsed ||
                    'Contrôle direct de l’identité émettrice, de la signature TLS du domaine officiel et absence de frais de dossier frauduleux.'}
                </p>
              </div>

              {/* Proof points */}
              <div>
                <h5 className="text-xs font-bold text-slate-900 mb-2">Éléments de preuve enregistrés</h5>
                <ul className="space-y-1.5">
                  {(opportunity.verificationDetails?.proofPoints || [
                    'Lien officiel vérifié',
                    'Absence de frais illégitimes',
                  ]).map((pt, i) => (
                    <li key={i} className="text-xs p-2 rounded bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-800">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'letter' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Trame de lettre de motivation personnalisée
                  </h4>
                  <p className="text-xs text-slate-500">
                    Générée à partir des critères confirmés et des compétences de votre profil.
                  </p>
                </div>
                <button
                  onClick={handleCopyLetter}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {copiedLetter ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copier le texte
                    </>
                  )}
                </button>
              </div>

              <textarea
                readOnly
                value={generatedCoverLetter}
                rows={12}
                className="w-full text-xs font-mono p-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(opportunity.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {favorite ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-blue-600 fill-blue-100" />
                  Enregistré
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-slate-500" />
                  Mettre en favoris
                </>
              )}
            </button>

            <button
              onClick={() => onOpenReport(opportunity)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              Signaler un doute
            </button>
          </div>

          <div className="flex items-center gap-2">
            {application ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Candidature suivie ({application.status})
              </span>
            ) : (
              <button
                onClick={handleTrackApplication}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
              >
                <Briefcase className="w-4 h-4" />
                Suivre cette candidature
              </button>
            )}

            <a
              href={opportunity.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              Accéder au site officiel
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
