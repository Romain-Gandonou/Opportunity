// Opportunity Trust - Application Context & State Management
// Handles auth, applications, verification workflow, reports, and persistence

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Opportunity,
  UserProfile,
  Application,
  ApplicationTask,
  Report,
  AuditEvent,
  InAppNotification,
  EditorialStatus,
  VerificationStatus,
  ApplicationStatus,
} from '../types';
import {
  INITIAL_PROFILES,
  INITIAL_OPPORTUNITIES,
  INITIAL_REPORTS,
  INITIAL_AUDIT_EVENTS,
} from '../data/seedData';
import { canTransitionApplicationStatus } from '../utils/opportunityLogic';

interface AppContextType {
  currentUser: UserProfile | null;
  opportunities: Opportunity[];
  applications: Application[];
  favorites: string[];
  reports: Report[];
  auditEvents: AuditEvent[];
  notifications: InAppNotification[];
  unreadNotificationCount: number;

  // Auth & Profile
  switchUserRole: (role: 'visitor' | 'user' | 'admin') => void;
  loginUser: (email: string) => boolean;
  registerUser: (profile: Partial<UserProfile>) => boolean;
  logoutUser: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  deleteAccount: () => void;
  exportUserData: () => void;

  // Favorites
  toggleFavorite: (opportunityId: string) => void;
  isFavorite: (opportunityId: string) => boolean;

  // Applications
  getUserApplicationForOpportunity: (opportunityId: string) => Application | undefined;
  createApplication: (opportunityId: string, status?: ApplicationStatus, deadline?: string, notes?: string) => Application;
  updateApplicationStatus: (applicationId: string, newStatus: ApplicationStatus) => boolean;
  updateApplicationDetails: (applicationId: string, updates: Partial<Application>) => void;
  addApplicationTask: (applicationId: string, label: string) => void;
  toggleApplicationTask: (applicationId: string, taskId: string) => void;
  deleteApplicationTask: (applicationId: string, taskId: string) => void;
  deleteApplication: (applicationId: string) => void;

  // Reports
  submitReport: (opportunityId: string, reason: Report['reason'], description: string, email?: string) => void;
  adminResolveReport: (reportId: string, status: Report['status'], adminNotes: string) => void;

  // Admin Ops
  adminCreateOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt' | 'lastVerifiedDate'>) => void;
  adminUpdateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  adminChangeVerification: (id: string, newStatus: VerificationStatus, methodUsed: string, proof: string[]) => void;
  adminChangeEditorialStatus: (id: string, newStatus: EditorialStatus, reason: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Reset to seed
  resetDataToFactory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Current user (default to fatoumata for rich demo experience)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ot_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PROFILES[0];
      }
    }
    return INITIAL_PROFILES[0];
  });

  // 2. Opportunities list
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('ot_opportunities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_OPPORTUNITIES;
      }
    }
    return INITIAL_OPPORTUNITIES;
  });

  // 3. User Applications
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('ot_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    // Seed an initial application for user fatoumata
    return [
      {
        id: 'app-seed-1',
        userId: 'user-fatoumata',
        opportunityId: 'opp-benin-dbsu-2027',
        status: 'in_progress',
        personalDeadline: '2026-12-01',
        privateNotes: 'Dossier académique bien avancé. Faire certifier les relevés de notes de Licence par le rectorat.',
        tasks: [
          { id: 't-1', applicationId: 'app-seed-1', label: 'Légaliser l’attestation de Licence et relevés', isCompleted: true },
          { id: 't-2', applicationId: 'app-seed-1', label: 'Finaliser la lettre de motivation projet STEM', isCompleted: true },
          { id: 't-3', applicationId: 'app-seed-1', label: 'Obtenir la lettre de recommandation du Pr. Kpadonou', isCompleted: false, dueDate: '2026-11-15' },
          { id: 't-4', applicationId: 'app-seed-1', label: 'Vérifier la validité du certificat de nationalité', isCompleted: true },
        ],
        createdAt: '2026-10-10T10:00:00Z',
        updatedAt: '2026-10-20T12:00:00Z',
      },
    ];
  });

  // 4. Favorites (per user)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('ot_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['opp-benin-dbsu-2027', 'opp-tef-2027'];
      }
    }
    return ['opp-benin-dbsu-2027', 'opp-tef-2027'];
  });

  // 5. Reports
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('ot_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_REPORTS;
      }
    }
    return INITIAL_REPORTS;
  });

  // 6. Audit Events
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => {
    const saved = localStorage.getItem('ot_audit_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_AUDIT_EVENTS;
      }
    }
    return INITIAL_AUDIT_EVENTS;
  });

  // 7. Notifications
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem('ot_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [
          {
            id: 'notif-1',
            userId: 'user-fatoumata',
            title: 'Rappel d’échéance : Bourses DBSU STEM',
            message: 'Il vous reste 49 jours avant la clôture officielle du dépôt des candidatures.',
            type: 'deadline_alert',
            read: false,
            createdAt: '2026-10-22T08:00:00Z',
            idempotencyKey: 'deadline_opp-benin-dbsu-2027_j49',
            opportunityId: 'opp-benin-dbsu-2027',
          },
          {
            id: 'notif-2',
            userId: 'user-fatoumata',
            title: 'Nouvelle opportunité vérifiée dans votre domaine',
            message: 'Le Hackathon Régional Cybersécurité ASIN Bénin vient d’être contrôlé et publié.',
            type: 'new_match',
            read: false,
            createdAt: '2026-10-21T14:00:00Z',
            idempotencyKey: 'newmatch_opp-asin-hackathon',
            opportunityId: 'opp-asin-hackathon',
          },
        ];
      }
    }
    return [];
  });

  // Sync state to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ot_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ot_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ot_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('ot_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('ot_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('ot_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('ot_audit_events', JSON.stringify(auditEvents));
  }, [auditEvents]);

  useEffect(() => {
    localStorage.setItem('ot_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Actions
  const switchUserRole = (role: 'visitor' | 'user' | 'admin') => {
    if (role === 'visitor') {
      setCurrentUser(null);
    } else if (role === 'user') {
      setCurrentUser(INITIAL_PROFILES[0]);
    } else if (role === 'admin') {
      setCurrentUser(INITIAL_PROFILES[1]);
    }
  };

  const loginUser = (email: string) => {
    const existing = INITIAL_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return true;
    }
    // Create new profile for unknown email
    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      role: 'user',
      countryOfResidence: 'Bénin',
      educationLevel: 'master',
      fieldOfStudy: 'Général',
      skills: [],
      languages: ['Français'],
      interests: ['scholarships'],
      emailVerified: true,
      notificationPreferences: {
        deadlineReminders: true,
        newOpportunitiesInField: true,
        verificationUpdates: true,
        emailAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentUser(newProfile);
    return true;
  };

  const registerUser = (profileData: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      email: profileData.email || 'nouveau@opportunite.bj',
      displayName: profileData.displayName || 'Nouvel Utilisateur',
      role: 'user',
      countryOfResidence: profileData.countryOfResidence || 'Bénin',
      educationLevel: profileData.educationLevel || 'bachelor',
      fieldOfStudy: profileData.fieldOfStudy || '',
      skills: profileData.skills || [],
      languages: profileData.languages || ['Français'],
      interests: profileData.interests || ['scholarships'],
      emailVerified: true,
      notificationPreferences: {
        deadlineReminders: true,
        newOpportunitiesInField: true,
        verificationUpdates: true,
        emailAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentUser(newProfile);
    return true;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setCurrentUser(updated);
  };

  const deleteAccount = () => {
    if (!currentUser) return;
    const uid = currentUser.id;
    // Remove user applications, favorites and profile
    setApplications((prev) => prev.filter((a) => a.userId !== uid));
    setNotifications((prev) => prev.filter((n) => n.userId !== uid));
    setFavorites([]);
    setCurrentUser(null);
    localStorage.removeItem('ot_current_user');
  };

  const exportUserData = () => {
    if (!currentUser) return;
    const userApps = applications.filter((a) => a.userId === currentUser.id);
    const userFavs = opportunities.filter((o) => favorites.includes(o.id));
    const userNotifs = notifications.filter((n) => n.userId === currentUser.id);

    const exportPayload = {
      exportTimestamp: new Date().toISOString(),
      platform: 'Opportunity Trust - www.opportunity-trust.org',
      legalNotice: 'Export de données personnelles au format ouvert (Portabilité & Droits RGPD / Code du Numérique du Bénin)',
      profile: currentUser,
      applications: userApps,
      favorites: userFavs.map((f) => ({ id: f.id, title: f.title, organization: f.organization, deadline: f.deadline })),
      notifications: userNotifs,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `opportunity-trust-export-${currentUser.id}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleFavorite = (opportunityId: string) => {
    setFavorites((prev) => {
      if (prev.includes(opportunityId)) {
        return prev.filter((id) => id !== opportunityId);
      } else {
        return [...prev, opportunityId];
      }
    });
  };

  const isFavorite = (opportunityId: string) => {
    return favorites.includes(opportunityId);
  };

  const getUserApplicationForOpportunity = (opportunityId: string) => {
    if (!currentUser) return undefined;
    return applications.find((a) => a.userId === currentUser.id && a.opportunityId === opportunityId);
  };

  const createApplication = (
    opportunityId: string,
    status: ApplicationStatus = 'to_prepare',
    personalDeadline?: string,
    privateNotes = ''
  ): Application => {
    const uid = currentUser ? currentUser.id : 'anon-user';
    const opp = opportunities.find((o) => o.id === opportunityId);
    
    // Default tailored checklist items based on opportunity type
    const defaultTasks: ApplicationTask[] = [
      { id: `t-${Date.now()}-1`, applicationId: '', label: 'Préparer et actualiser le CV ciblé', isCompleted: false },
      { id: `t-${Date.now()}-2`, applicationId: '', label: 'Rédiger le projet de lettre de motivation', isCompleted: false },
      { id: `t-${Date.now()}-3`, applicationId: '', label: 'Rassembler les relevés de notes et attestations de diplômes', isCompleted: false },
      { id: `t-${Date.now()}-4`, applicationId: '', label: 'Vérifier la pièce d’identité / passeport en cours de validité', isCompleted: false },
    ];

    if (opp?.language === 'Anglais' || opp?.language === 'Bilingue') {
      defaultTasks.push({
        id: `t-${Date.now()}-5`,
        applicationId: '',
        label: 'Préparer attestation / score de test d’anglais (TOEFL / IELTS)',
        isCompleted: false,
      });
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      userId: uid,
      opportunityId,
      status,
      personalDeadline: personalDeadline || opp?.deadline || undefined,
      privateNotes,
      tasks: defaultTasks.map((t) => ({ ...t, applicationId: `app-${Date.now()}` })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setApplications((prev) => {
      // Prevent duplicates
      const filtered = prev.filter((a) => !(a.userId === uid && a.opportunityId === opportunityId));
      return [newApp, ...filtered];
    });

    return newApp;
  };

  const updateApplicationStatus = (applicationId: string, newStatus: ApplicationStatus): boolean => {
    const existing = applications.find((a) => a.id === applicationId);
    if (!existing) return false;

    if (!canTransitionApplicationStatus(existing.status, newStatus)) {
      console.warn(`Transition interdite de ${existing.status} vers ${newStatus}`);
      return false;
    }

    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? { ...a, status: newStatus, updatedAt: new Date().toISOString() }
          : a
      )
    );
    return true;
  };

  const updateApplicationDetails = (applicationId: string, updates: Partial<Application>) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? { ...a, ...updates, updatedAt: new Date().toISOString() }
          : a
      )
    );
  };

  const addApplicationTask = (applicationId: string, label: string) => {
    const newTask: ApplicationTask = {
      id: `task-${Date.now()}`,
      applicationId,
      label: label.trim(),
      isCompleted: false,
    };
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId ? { ...a, tasks: [...a.tasks, newTask] } : a
      )
    );
  };

  const toggleApplicationTask = (applicationId: string, taskId: string) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== applicationId) return a;
        return {
          ...a,
          tasks: a.tasks.map((t) =>
            t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
          ),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const deleteApplicationTask = (applicationId: string, taskId: string) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== applicationId) return a;
        return {
          ...a,
          tasks: a.tasks.filter((t) => t.id !== taskId),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const deleteApplication = (applicationId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== applicationId));
  };

  const submitReport = (
    opportunityId: string,
    reason: Report['reason'],
    description: string,
    email?: string
  ) => {
    const opp = opportunities.find((o) => o.id === opportunityId);
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      opportunityId,
      opportunityTitle: opp ? opp.title : 'Opportunité référencée',
      reason,
      description,
      reporterEmail: email || (currentUser ? currentUser.email : undefined),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);

    // Record audit event
    const audit: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentUser ? currentUser.displayName : 'Visiteur anonyme',
      action: 'SUBMIT_REPORT',
      resource: opportunityId,
      result: 'success',
      details: `Signalement motif: ${reason}`,
    };
    setAuditEvents((prev) => [audit, ...prev]);
  };

  const adminResolveReport = (reportId: string, status: Report['status'], adminNotes: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status,
              adminNotes,
              resolvedAt: status === 'resolved' || status === 'dismissed' ? new Date().toISOString() : undefined,
            }
          : r
      )
    );

    const audit: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentUser?.displayName || 'Admin',
      action: 'RESOLVE_REPORT',
      resource: reportId,
      result: 'success',
      details: `Statut signalement passé à: ${status}. Note: ${adminNotes.slice(0, 50)}`,
    };
    setAuditEvents((prev) => [audit, ...prev]);
  };

  const adminCreateOpportunity = (
    oppData: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt' | 'lastVerifiedDate'>
  ) => {
    const newId = `opp-${Date.now()}`;
    const newOpp: Opportunity = {
      ...oppData,
      id: newId,
      lastVerifiedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOpportunities((prev) => [newOpp, ...prev]);

    const audit: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentUser?.displayName || 'Admin',
      action: 'CREATE_OPPORTUNITY',
      resource: newId,
      result: 'success',
      details: `Création annonce: ${newOpp.title.slice(0, 45)}`,
    };
    setAuditEvents((prev) => [audit, ...prev]);
  };

  const adminUpdateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
      )
    );

    const audit: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentUser?.displayName || 'Admin',
      action: 'UPDATE_OPPORTUNITY',
      resource: id,
      result: 'success',
      details: `Mise à jour des champs d’opportunité`,
    };
    setAuditEvents((prev) => [audit, ...prev]);
  };

  const adminChangeVerification = (
    id: string,
    newStatus: VerificationStatus,
    methodUsed: string,
    proof: string[]
  ) => {
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        return {
          ...o,
          verificationStatus: newStatus,
          lastVerifiedDate: new Date().toISOString(),
          verificationDetails: {
            methodUsed,
            verifiedBy: currentUser?.displayName || 'Auditeur Opportunity Trust',
            proofPoints: proof,
            officialContactProvided: o.verificationDetails?.officialContactProvided,
          },
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const audit: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentUser?.displayName || 'Admin',
      action: 'CHANGE_VERIFICATION_LEVEL',
      resource: id,
      result: 'success',
      details: `Niveau modifié en : ${newStatus}. Méthode : ${methodUsed}`,
    };
    setAuditEvents((prev) => [audit, ...prev]);
  };

  const adminChangeEditorialStatus = (
    id: string,
    newStatus: EditorialStatus,
    reason: string
  ) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, editorialStatus: newStatus, updatedAt: new Date().toISOString() } : o))
    );

    const audit: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentUser?.displayName || 'Admin',
      action: 'CHANGE_EDITORIAL_STATUS',
      resource: id,
      result: 'success',
      details: `Statut éditorial changé en : ${newStatus}. Réf : ${reason}`,
    };
    setAuditEvents((prev) => [audit, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetDataToFactory = () => {
    localStorage.clear();
    setOpportunities(INITIAL_OPPORTUNITIES);
    setReports(INITIAL_REPORTS);
    setAuditEvents(INITIAL_AUDIT_EVENTS);
    setApplications([]);
    setFavorites(['opp-benin-dbsu-2027', 'opp-tef-2027']);
    setCurrentUser(INITIAL_PROFILES[0]);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        opportunities,
        applications,
        favorites,
        reports,
        auditEvents,
        notifications,
        unreadNotificationCount,
        switchUserRole,
        loginUser,
        registerUser,
        logoutUser,
        updateProfile,
        deleteAccount,
        exportUserData,
        toggleFavorite,
        isFavorite,
        getUserApplicationForOpportunity,
        createApplication,
        updateApplicationStatus,
        updateApplicationDetails,
        addApplicationTask,
        toggleApplicationTask,
        deleteApplicationTask,
        deleteApplication,
        submitReport,
        adminResolveReport,
        adminCreateOpportunity,
        adminUpdateOpportunity,
        adminChangeVerification,
        adminChangeEditorialStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetDataToFactory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
