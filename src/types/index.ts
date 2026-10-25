// Opportunity Trust - Core Type Definitions
// Conforme au Cahier des Charges Technique et Fonctionnel v1.0

export type VerificationStatus = 
  | 'unverified'     // Source non vérifiée
  | 'identified'     // Source identifiée
  | 'controlled'     // Source contrôlée
  | 'cross_checked'; // Informations recoupées

export type EditorialStatus = 
  | 'draft'          // Brouillon
  | 'pending_review' // En cours de vérification
  | 'published'      // Publiée
  | 'suspended'      // Suspendue
  | 'archived';      // Archivée

export type OpportunityCategory = 
  | 'scholarships'   // Bourses et études
  | 'internships'    // Stages
  | 'jobs'           // Emplois
  | 'trainings'      // Formations
  | 'competitions'   // Concours et programmes
  | 'grants';        // Subventions et financements

export type FundingType = 
  | 'full'           // Entièrement financé / Bourse complète
  | 'partial'        // Financement partiel
  | 'salary'         // Salaire / Rémunéré
  | 'grant'          // Dotation / Subvention
  | 'unfunded';      // Non rémunéré / Frais à la charge du candidat

export type StudyLevel = 
  | 'high_school'    // Baccalauréat / Secondaire
  | 'bachelor'       // Licence / Bachelor (Bac+3)
  | 'master'         // Master (Bac+5)
  | 'doctorate'      // Doctorat / PhD
  | 'postdoc'        // Post-doctorat
  | 'all_levels';    // Tous niveaux / Ouvert à tous

export interface OpportunitySource {
  id: string;
  opportunityId: string;
  url: string;
  organizationName: string;
  sourceType: 'official_site' | 'ministry' | 'embassy' | 'university' | 'international_org' | 'partner_ngo';
  lastCheckedDate: string;
  isOfficialDomain: boolean;
  notes: string;
  checkerId: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  description: string;
  summary?: string;
  country: string; // Ex: 'Bénin', 'France', 'Afrique de l\'Ouest', 'International'
  locationType: 'on_site' | 'remote' | 'hybrid';
  language: 'Français' | 'Anglais' | 'Bilingue' | 'Autre';
  targetAudience: string;
  eligibilityCriteria: string[];
  fundingType: FundingType;
  studyLevel: StudyLevel;
  publicationDate: string; // ISO string
  deadline: string | null; // ISO string or null if continuous/unknown
  lastVerifiedDate: string; // ISO string
  sourceUrl: string;
  editorialStatus: EditorialStatus;
  verificationStatus: VerificationStatus;
  verificationDetails: {
    methodUsed: string;
    verifiedBy: string;
    proofPoints: string[];
    officialContactProvided?: string;
  };
  sources: OpportunitySource[];
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 
  | 'to_review'      // À examiner
  | 'to_prepare'     // À préparer
  | 'in_progress'    // En cours
  | 'submitted'      // Soumise
  | 'accepted'       // Acceptée
  | 'rejected'       // Refusée
  | 'withdrawn';     // Abandonnée

export interface ApplicationTask {
  id: string;
  applicationId: string;
  label: string;
  isCompleted: boolean;
  dueDate?: string;
}

export interface Application {
  id: string;
  userId: string;
  opportunityId: string;
  status: ApplicationStatus;
  personalDeadline?: string;
  privateNotes: string;
  tasks: ApplicationTask[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'visitor' | 'user' | 'admin';
  countryOfResidence: string;
  educationLevel: StudyLevel;
  fieldOfStudy: string;
  skills: string[];
  languages: string[];
  interests: OpportunityCategory[];
  emailVerified: boolean;
  notificationPreferences: {
    deadlineReminders: boolean; // J-7, J-3, J-1
    newOpportunitiesInField: boolean;
    verificationUpdates: boolean;
    emailAlerts: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deadline_alert' | 'status_change' | 'security_warning' | 'new_match';
  read: boolean;
  createdAt: string;
  idempotencyKey: string;
  opportunityId?: string;
}

export type ReportReason = 
  | 'expired_notice'       // Annonce expirée
  | 'incorrect_info'       // Information erronée
  | 'broken_link'          // Lien brisé
  | 'fraud_suspicion'      // Suspicion de fraude / Frais illégitimes demandés
  | 'identity_theft'       // Usurpation d'organisme
  | 'duplicate';           // Doublon

export interface Report {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  reason: ReportReason;
  description: string;
  reporterEmail?: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  result: 'success' | 'failure';
  details: string;
}

export interface FilterState {
  searchQuery: string;
  category: OpportunityCategory | 'all';
  country: string;
  studyLevel: StudyLevel | 'all';
  fundingType: FundingType | 'all';
  verificationStatus: VerificationStatus | 'all';
  hideExpired: boolean;
  sortBy: 'recent' | 'deadline_asc' | 'trust_desc';
}
