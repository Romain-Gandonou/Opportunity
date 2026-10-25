import { OpportunityCategory, FundingType, StudyLevel, ApplicationStatus } from '../types';

export const CATEGORY_LABELS: Record<OpportunityCategory, string> = {
  scholarships: 'Bourses et études',
  internships: 'Stages',
  jobs: 'Emplois',
  trainings: 'Formations',
  competitions: 'Concours et programmes',
  grants: 'Subventions et financements',
};

export const FUNDING_LABELS: Record<FundingType, string> = {
  full: 'Bourse complète / 100% financé',
  partial: 'Financement partiel',
  salary: 'Rémunéré / Salaire',
  grant: 'Subvention / Dotation',
  unfunded: 'Frais personnels requis',
};

export const STUDY_LEVEL_LABELS: Record<StudyLevel, string> = {
  high_school: 'Baccalauréat / Secondaire',
  bachelor: 'Licence / Bachelor (Bac+3)',
  master: 'Master (Bac+5)',
  doctorate: 'Doctorat / PhD',
  postdoc: 'Post-doctorat',
  all_levels: 'Tous niveaux d’études',
};

export const APPLICATION_STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; badgeBg: string; description: string }
> = {
  to_review: {
    label: 'À examiner',
    color: 'text-slate-700 bg-slate-100 border-slate-200',
    badgeBg: 'bg-slate-500',
    description: 'Enregistrée pour analyse des critères d’éligibilité.',
  },
  to_prepare: {
    label: 'À préparer',
    color: 'text-amber-800 bg-amber-50 border-amber-200',
    badgeBg: 'bg-amber-500',
    description: 'Rassemblement des pièces justificatives et rédaction en cours.',
  },
  in_progress: {
    label: 'Dossier en cours',
    color: 'text-blue-800 bg-blue-50 border-blue-200',
    badgeBg: 'bg-blue-600',
    description: 'Candidature active, formulaire officiel en saisie.',
  },
  submitted: {
    label: 'Soumise',
    color: 'text-purple-800 bg-purple-50 border-purple-200',
    badgeBg: 'bg-purple-600',
    description: 'Dossier déposé auprès de l’organisme officiel. En attente de délibération.',
  },
  accepted: {
    label: 'Acceptée / Retenue',
    color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    badgeBg: 'bg-emerald-600',
    description: 'Félicitations ! Votre candidature a été retenue.',
  },
  rejected: {
    label: 'Non retenue',
    color: 'text-rose-800 bg-rose-50 border-rose-200',
    badgeBg: 'bg-rose-600',
    description: 'Dossier non retenu pour cette session.',
  },
  withdrawn: {
    label: 'Abandonnée',
    color: 'text-gray-600 bg-gray-100 border-gray-200',
    badgeBg: 'bg-gray-400',
    description: 'Démarche interrompue.',
  },
};

export function formatDateFr(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Date non spécifiée';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Date non valide';
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
