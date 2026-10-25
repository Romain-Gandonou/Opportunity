// Pure Business Logic for Opportunity Trust
// Conforme au Cahier des charges: calculs purs, intégrité, détection doublons, permissions

import {
  Opportunity,
  UserProfile,
  ApplicationStatus,
  FilterState,
  VerificationStatus,
} from '../types';

/**
 * Détermine si une opportunité a dépassé son échéance.
 * Ne fabrique jamais de fausse date si null.
 */
export function isOpportunityExpired(deadline: string | null, refDate = new Date()): boolean {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  if (isNaN(deadlineDate.getTime())) return false;
  return deadlineDate.getTime() < refDate.getTime();
}

/**
 * Calcule le nombre de jours restants jusqu'à l'échéance.
 * Retourne null si aucune échéance n'est définie.
 */
export function calculateDaysRemaining(deadline: string | null, refDate = new Date()): number | null {
  if (!deadline) return null;
  const deadlineDate = new Date(deadline);
  if (isNaN(deadlineDate.getTime())) return null;
  const diffTime = deadlineDate.getTime() - refDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Normalise une URL pour comparaison et détection de doublons.
 * Supprime les paramètres de tracking (utm, fbclid, ref), les barres obliques finales et convertit en minuscules.
 */
export function normalizeUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl.trim());
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'ref', 'source'];
    trackingParams.forEach((param) => parsed.searchParams.delete(param));
    
    let path = parsed.pathname;
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    
    const search = parsed.search ? parsed.search : '';
    return `${parsed.protocol}//${parsed.hostname.toLowerCase()}${path}${search}`;
  } catch {
    return rawUrl.trim().toLowerCase().replace(/\/+$/, '');
  }
}

/**
 * Calcule un score de similarité textuelle entre deux titres (0 à 1).
 * Utilise la distance de Jaccard sur les n-grammes/tokens de mots nettoyés.
 */
export function calculateSimilarityScore(str1: string, str2: string): number {
  const tokenize = (s: string): Set<string> => {
    return new Set(
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );
  };

  const tokens1 = tokenize(str1);
  const tokens2 = tokenize(str2);

  if (tokens1.size === 0 && tokens2.size === 0) return 1;
  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  let intersectionCount = 0;
  for (const token of tokens1) {
    if (tokens2.has(token)) {
      intersectionCount++;
    }
  }

  const unionCount = new Set([...tokens1, ...tokens2]).size;
  return intersectionCount / unionCount;
}

/**
 * Valide les transitions de statut d'une candidature.
 * Garantit qu'un candidat ne passe pas par des états incohérents.
 */
export function canTransitionApplicationStatus(
  current: ApplicationStatus,
  target: ApplicationStatus
): boolean {
  if (current === target) return true;

  const validTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
    to_review: ['to_prepare', 'in_progress', 'withdrawn'],
    to_prepare: ['in_progress', 'submitted', 'withdrawn'],
    in_progress: ['submitted', 'to_prepare', 'withdrawn'],
    submitted: ['accepted', 'rejected', 'withdrawn'],
    accepted: ['withdrawn'],
    rejected: ['withdrawn'],
    withdrawn: ['to_review', 'to_prepare', 'in_progress'], // possibilité de réouverture
  };

  return validTransitions[current]?.includes(target) ?? false;
}

/**
 * Contrôle d'accès et isolation des données selon le principe de moindre privilège.
 * Règle métier : Un utilisateur A ne peut JAMAIS modifier ou lire les données d'un utilisateur B.
 * Seul un Admin a accès aux fonctions d'administration.
 */
export function checkPermission(
  userRole: 'visitor' | 'user' | 'admin',
  resourceOwnerId?: string,
  currentUserId?: string,
  action: 'read' | 'write' | 'admin' = 'read'
): boolean {
  if (action === 'admin') {
    return userRole === 'admin';
  }

  // Pour les ressources privées (candidatures, favoris, profil)
  if (resourceOwnerId) {
    if (!currentUserId) return false;
    // Isolation absolue : propriétaire uniquement (ou admin pour modération)
    return currentUserId === resourceOwnerId || userRole === 'admin';
  }

  return true;
}

export interface EligibilityResult {
  score: number; // 0 to 100
  percentageMatch: number;
  matchingCriteria: string[];
  missingCriteria: string[];
  recommendations: string[];
  isEligible: boolean;
}

/**
 * Évalue la compatibilité entre un profil utilisateur et les critères d'une opportunité.
 * Déterministe, sans hallucination ni extrapolation injustifiée.
 */
export function calculateEligibilityScore(
  profile: Partial<UserProfile>,
  opp: Opportunity
): EligibilityResult {
  const matchingCriteria: string[] = [];
  const missingCriteria: string[] = [];
  const recommendations: string[] = [];

  let points = 0;
  let totalPoints = 0;

  // 1. Niveau d'études (Poids 30)
  totalPoints += 30;
  if (opp.studyLevel === 'all_levels') {
    points += 30;
    matchingCriteria.push("Ouvert à tous les niveaux d'études");
  } else if (profile.educationLevel) {
    const levelHierarchy: Record<string, number> = {
      high_school: 1,
      bachelor: 2,
      master: 3,
      doctorate: 4,
      postdoc: 5,
    };
    const userLvl = levelHierarchy[profile.educationLevel] || 0;
    const oppLvl = levelHierarchy[opp.studyLevel] || 0;

    if (userLvl >= oppLvl) {
      points += 30;
      matchingCriteria.push(`Votre niveau d'études (${profile.educationLevel}) satisfait ou dépasse le prérequis (${opp.studyLevel})`);
    } else {
      missingCriteria.push(`Niveau requis : ${opp.studyLevel} (Votre profil : ${profile.educationLevel})`);
      recommendations.push("Vérifier si des équivalences ou dérogations d'expérience professionnelle sont admises.");
    }
  } else {
    missingCriteria.push(`Niveau d'études requis : ${opp.studyLevel}`);
    recommendations.push("Renseignez votre niveau d'études dans votre profil pour une évaluation précise.");
  }

  // 2. Langue (Poids 20)
  totalPoints += 20;
  if (opp.language === 'Français') {
    const hasFrench = profile.languages?.some((l) => l.toLowerCase().includes('franç') || l.toLowerCase().includes('french'));
    if (hasFrench || !profile.languages || profile.languages.length === 0) {
      // Par défaut en zone francophone
      points += 20;
      matchingCriteria.push("Langue de travail française maîtrisée");
    } else {
      missingCriteria.push("Opportunité dispensée en français");
    }
  } else if (opp.language === 'Anglais' || opp.language === 'Bilingue') {
    const hasEnglish = profile.languages?.some((l) => l.toLowerCase().includes('anglais') || l.toLowerCase().includes('english'));
    if (hasEnglish) {
      points += 20;
      matchingCriteria.push("Compétences linguistiques en anglais confirmées");
    } else {
      missingCriteria.push("Maîtrise de l'anglais requise (TOEFL, IELTS ou attestation académique)");
      recommendations.push("Préparez une attestation de niveau d'anglais ou un test certifié si nécessaire.");
    }
  } else {
    points += 20;
  }

  // 3. Domaine d'intérêt / Catégorie (Poids 25)
  totalPoints += 25;
  if (profile.interests && profile.interests.includes(opp.category)) {
    points += 25;
    matchingCriteria.push(`Catégorie "${opp.category}" alignée avec vos objectifs prioritaires`);
  } else {
    points += 15; // Opportunité connexe
  }

  // 4. Zone géographique / Nationalité (Poids 25)
  totalPoints += 25;
  const oppCountryLower = opp.country.toLowerCase();
  const userCountryLower = (profile.countryOfResidence || '').toLowerCase();

  if (
    oppCountryLower.includes('international') ||
    oppCountryLower.includes('afrique') ||
    (userCountryLower && oppCountryLower.includes(userCountryLower))
  ) {
    points += 25;
    matchingCriteria.push(`Éligible pour les résidents / ressortissants : ${opp.country}`);
  } else {
    missingCriteria.push(`Zone prioritaire annoncée : ${opp.country}`);
    recommendations.push("Consultez l'appel officiel pour vous assurer de la liste exacte des pays éligibles.");
  }

  const percentageMatch = Math.round((points / totalPoints) * 100);
  const isEligible = percentageMatch >= 65;

  return {
    score: points,
    percentageMatch,
    matchingCriteria,
    missingCriteria,
    recommendations,
    isEligible,
  };
}

/**
 * Filtrage déterministe et stable des opportunités.
 */
export function filterOpportunities(
  list: Opportunity[],
  filters: FilterState,
  refDate = new Date()
): Opportunity[] {
  return list.filter((opp) => {
    // 1. Statut éditorial (seules les publiées apparaissent au catalogue public)
    if (opp.editorialStatus !== 'published') {
      return false;
    }

    // 2. Échéance expirée
    if (filters.hideExpired && isOpportunityExpired(opp.deadline, refDate)) {
      return false;
    }

    // 3. Catégorie
    if (filters.category !== 'all' && opp.category !== filters.category) {
      return false;
    }

    // 4. Niveau d'études
    if (filters.studyLevel !== 'all' && opp.studyLevel !== 'all_levels' && opp.studyLevel !== filters.studyLevel) {
      return false;
    }

    // 5. Type de financement
    if (filters.fundingType !== 'all' && opp.fundingType !== filters.fundingType) {
      return false;
    }

    // 6. Statut de vérification
    if (filters.verificationStatus !== 'all' && opp.verificationStatus !== filters.verificationStatus) {
      return false;
    }

    // 7. Pays
    if (filters.country && filters.country !== 'all') {
      const cLower = filters.country.toLowerCase();
      if (!opp.country.toLowerCase().includes(cLower)) {
        return false;
      }
    }

    // 8. Recherche textuelle
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchOrg = opp.organization.toLowerCase().includes(q);
      const matchDesc = opp.description.toLowerCase().includes(q);
      const matchCountry = opp.country.toLowerCase().includes(q);
      if (!matchTitle && !matchOrg && !matchDesc && !matchCountry) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'recent') {
      return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
    }
    if (filters.sortBy === 'deadline_asc') {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (filters.sortBy === 'trust_desc') {
      const trustWeights: Record<VerificationStatus, number> = {
        cross_checked: 4,
        controlled: 3,
        identified: 2,
        unverified: 1,
      };
      return (trustWeights[b.verificationStatus] || 0) - (trustWeights[a.verificationStatus] || 0);
    }
    return 0;
  });
}
