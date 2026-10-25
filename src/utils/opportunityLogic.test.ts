// Unit tests for Opportunity Trust pure logic
// Built with node:test and node:assert/strict for fast deterministic verification

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isOpportunityExpired,
  calculateDaysRemaining,
  normalizeUrl,
  calculateSimilarityScore,
  canTransitionApplicationStatus,
  checkPermission,
  calculateEligibilityScore,
  filterOpportunities,
} from './opportunityLogic';
import { Opportunity, UserProfile, FilterState } from '../types';

const mockOpportunity: Opportunity = {
  id: 'opp-1',
  title: 'Bourses d’Excellence Master et Doctorat Bénin-France',
  organization: 'Ambassade de France au Bénin',
  category: 'scholarships',
  description: 'Programme de bourses complètes pour les étudiants béninois méritants.',
  country: 'Bénin',
  locationType: 'on_site',
  language: 'Français',
  targetAudience: 'Étudiants diplômés de Licence ou Master',
  eligibilityCriteria: ['Être de nationalité béninoise', 'Avoir au moins 14/20 de moyenne', 'Moins de 28 ans'],
  fundingType: 'full',
  studyLevel: 'master',
  publicationDate: '2026-10-01T00:00:00Z',
  deadline: '2026-12-15T23:59:59Z',
  lastVerifiedDate: '2026-10-20T10:00:00Z',
  sourceUrl: 'https://bj.ambafrance.org/bourses-2026?utm_source=twitter&ref=123',
  editorialStatus: 'published',
  verificationStatus: 'cross_checked',
  verificationDetails: {
    methodUsed: 'Recoupement arrêté ministériel et portail Campus France Bénin',
    verifiedBy: 'Équipe d’audit Opportunity Trust',
    proofPoints: ['Domaine officiel .gouv.fr vérifié', 'Appel signé par le SCAC'],
  },
  sources: [],
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-20T10:00:00Z',
};

test('isOpportunityExpired accurately checks deadline vs reference date', () => {
  const refDate = new Date('2026-10-23T00:00:00Z');
  
  // Future deadline -> false
  assert.equal(isOpportunityExpired('2026-12-15T00:00:00Z', refDate), false);
  
  // Past deadline -> true
  assert.equal(isOpportunityExpired('2026-09-01T00:00:00Z', refDate), true);
  
  // Null deadline (ongoing / unknown) -> never falsely flagged as expired
  assert.equal(isOpportunityExpired(null, refDate), false);
});

test('calculateDaysRemaining computes exact day difference or returns null', () => {
  const refDate = new Date('2026-10-20T00:00:00Z');
  
  assert.equal(calculateDaysRemaining('2026-10-25T00:00:00Z', refDate), 5);
  assert.equal(calculateDaysRemaining(null, refDate), null);
  assert.equal(calculateDaysRemaining('invalid-date', refDate), null);
});

test('normalizeUrl strips tracking parameters, protocol casing, and trailing slash', () => {
  const input = 'https://BJ.AMBAFRANCE.org/bourses-2026/?utm_source=twitter&utm_medium=social&ref=123';
  const expected = 'https://bj.ambafrance.org/bourses-2026';
  assert.equal(normalizeUrl(input), expected);
});

test('calculateSimilarityScore detects near-duplicate announcements', () => {
  const t1 = 'Bourses d’Excellence Master et Doctorat Bénin-France';
  const t2 = 'Bourses d’Excellence Master et Doctorat Bénin France 2026';
  const score = calculateSimilarityScore(t1, t2);
  
  assert.ok(score > 0.6, `Similarity should be high for duplicate titles, got ${score}`);

  const tUnrelated = 'Stage Développeur Python Frontend Cotonou';
  const lowScore = calculateSimilarityScore(t1, tUnrelated);
  assert.ok(lowScore < 0.2, `Similarity should be near zero for distinct topics, got ${lowScore}`);
});

test('canTransitionApplicationStatus enforces strict application workflow transitions', () => {
  // Allowed
  assert.equal(canTransitionApplicationStatus('to_review', 'to_prepare'), true);
  assert.equal(canTransitionApplicationStatus('to_prepare', 'submitted'), true);
  assert.equal(canTransitionApplicationStatus('submitted', 'accepted'), true);
  assert.equal(canTransitionApplicationStatus('submitted', 'rejected'), true);
  assert.equal(canTransitionApplicationStatus('in_progress', 'withdrawn'), true);
  
  // Disallowed invalid jumps (e.g., directly to_review -> accepted without submission)
  assert.equal(canTransitionApplicationStatus('to_review', 'accepted'), false);
  assert.equal(canTransitionApplicationStatus('to_review', 'rejected'), false);
});

test('checkPermission enforces least privilege and multi-tenant data isolation', () => {
  // Visitor cannot access admin
  assert.equal(checkPermission('visitor', undefined, undefined, 'admin'), false);
  
  // Regular user cannot access admin
  assert.equal(checkPermission('user', undefined, 'user-1', 'admin'), false);
  
  // Admin can access admin
  assert.equal(checkPermission('admin', undefined, 'admin-1', 'admin'), true);
  
  // User 1 cannot access User 2 private application
  assert.equal(checkPermission('user', 'user-2', 'user-1', 'read'), false);
  
  // User 1 can access their own private application
  assert.equal(checkPermission('user', 'user-1', 'user-1', 'read'), true);
  
  // Admin can access for moderation
  assert.equal(checkPermission('admin', 'user-1', 'admin-super', 'read'), true);
});

test('calculateEligibilityScore evaluates candidate fit deterministically', () => {
  const matchingProfile: Partial<UserProfile> = {
    educationLevel: 'master',
    countryOfResidence: 'Bénin',
    languages: ['Français', 'Anglais'],
    interests: ['scholarships'],
  };

  const result = calculateEligibilityScore(matchingProfile, mockOpportunity);
  assert.ok(result.percentageMatch >= 70, `Fit should be high, got ${result.percentageMatch}%`);
  assert.equal(result.isEligible, true);
  assert.ok(result.matchingCriteria.length > 0);

  const underqualifiedProfile: Partial<UserProfile> = {
    educationLevel: 'high_school',
    countryOfResidence: 'Japon',
    languages: ['Japonais'],
    interests: ['internships'],
  };

  const resultUnder = calculateEligibilityScore(underqualifiedProfile, mockOpportunity);
  assert.ok(resultUnder.percentageMatch < 65, `Fit should be low, got ${resultUnder.percentageMatch}%`);
  assert.equal(resultUnder.isEligible, false);
  assert.ok(resultUnder.missingCriteria.length > 0);
});

test('filterOpportunities filters by category, status, and search keywords', () => {
  const list: Opportunity[] = [
    mockOpportunity,
    {
      ...mockOpportunity,
      id: 'opp-2',
      title: 'Stage Assistant Marketing Digital MTN Bénin',
      category: 'internships',
      fundingType: 'salary',
      studyLevel: 'bachelor',
      deadline: '2026-11-01T00:00:00Z',
    },
    {
      ...mockOpportunity,
      id: 'opp-3',
      title: 'Bourses DAAD Master Allemagne',
      editorialStatus: 'draft', // Draft must never appear in public catalogue
    },
  ];

  const defaultFilters: FilterState = {
    searchQuery: '',
    category: 'all',
    country: 'all',
    studyLevel: 'all',
    fundingType: 'all',
    verificationStatus: 'all',
    hideExpired: true,
    sortBy: 'recent',
  };

  // Draft is excluded from published catalogue
  const resAll = filterOpportunities(list, defaultFilters);
  assert.equal(resAll.length, 2);

  // Category filter
  const resScholarships = filterOpportunities(list, { ...defaultFilters, category: 'scholarships' });
  assert.equal(resScholarships.length, 1);
  assert.equal(resScholarships[0].id, 'opp-1');

  // Search keyword
  const resSearch = filterOpportunities(list, { ...defaultFilters, searchQuery: 'MTN' });
  assert.equal(resSearch.length, 1);
  assert.equal(resSearch[0].id, 'opp-2');
});
