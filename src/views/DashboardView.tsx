import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Application, ApplicationStatus, Opportunity } from '../types';
import { APPLICATION_STATUS_CONFIG, formatDateFr } from '../utils/formatters';
import { calculateDaysRemaining } from '../utils/opportunityLogic';
import { VerificationBadge } from '../components/VerificationBadge';
import {
  Briefcase,
  Bookmark,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Lock,
  ListTodo,
} from 'lucide-react';

interface DashboardViewProps {
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onOpenAuth: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectOpportunity,
  onOpenAuth,
}) => {
  const {
    currentUser,
    applications,
    opportunities,
    favorites,
    toggleFavorite,
    updateApplicationStatus,
    updateApplicationDetails,
    addApplicationTask,
    toggleApplicationTask,
    deleteApplicationTask,
    deleteApplication,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'applications' | 'favorites'>('applications');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [editingNotesAppId, setEditingNotesAppId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  if (!currentUser) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Espace personnel réservé</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Pour enregistrer des opportunités en favoris, suivre l'avancement de vos dossiers et gérer votre liste de
          pièces justificatives, connectez-vous ou créez un compte.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
        >
          Se connecter / S'inscrire
        </button>
      </div>
    );
  }

  // Filter applications belonging to current user
  const userApplications = applications.filter((a) => a.userId === currentUser.id);

  // Favorite opportunities
  const favoriteOpportunities = opportunities.filter((o) => favorites.includes(o.id));

  // Active selected application for detailed checklist
  const selectedApp =
    userApplications.find((a) => a.id === selectedAppId) || userApplications[0];

  const selectedOpp = selectedApp
    ? opportunities.find((o) => o.id === selectedApp.opportunityId)
    : undefined;

  const handleStartEditNotes = (app: Application) => {
    setEditingNotesAppId(app.id);
    setTempNotes(app.privateNotes || '');
  };

  const handleSaveNotes = (appId: string) => {
    updateApplicationDetails(appId, { privateNotes: tempNotes });
    setEditingNotesAppId(null);
  };

  const handleAddTask = (e: React.FormEvent, appId: string) => {
    e.preventDefault();
    if (!newTaskLabel.trim()) return;
    addApplicationTask(appId, newTaskLabel.trim());
    setNewTaskLabel('');
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Espace Candidat : {currentUser.displayName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez vos démarches, pièces justificatives et dates limites en toute confidentialité
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'applications'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Suivi des dossiers ({userApplications.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'favorites'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Favoris ({favoriteOpportunities.length})
          </button>
        </div>
      </div>

      {activeTab === 'applications' && (
        <div className="space-y-6">
          {userApplications.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Aucune candidature suivie pour le moment</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Consultez le catalogue et cliquez sur "Suivre cette candidature" pour organiser vos pièces et recevoir
                des alertes d'échéances.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Applications list */}
              <div className="space-y-3 lg:col-span-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
                  Vos candidatures en cours
                </h2>

                <div className="space-y-2">
                  {userApplications.map((app) => {
                    const opp = opportunities.find((o) => o.id === app.opportunityId);
                    const isSelected = selectedApp?.id === app.id;
                    const completedTasks = app.tasks.filter((t) => t.isCompleted).length;
                    const totalTasks = app.tasks.length;
                    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                    const statusConfig = APPLICATION_STATUS_CONFIG[app.status];

                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedAppId(app.id)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusConfig.color}`}
                          >
                            {statusConfig.label}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {completedTasks}/{totalTasks} pièces
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                          {opp?.title || 'Opportunité'}
                        </h4>
                        <p className="text-[11px] text-blue-700 font-medium mt-0.5 truncate">
                          {opp?.organization}
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                            <span>Avancement checklist</span>
                            <span className="font-semibold text-slate-700">{progressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Application Detail, Status Transition, Tasks & Notes */}
              {selectedApp && selectedOpp && (
                <div className="lg:col-span-2 space-y-6">
                  {/* Selected Card Header */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-blue-700">{selectedOpp.organization}</span>
                          <VerificationBadge status={selectedOpp.verificationStatus} size="sm" />
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">
                          {selectedOpp.title}
                        </h2>
                      </div>

                      <button
                        onClick={() => onSelectOpportunity(selectedOpp)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Voir fiche
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Status & Deadline Editor */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Statut de la candidature
                        </label>
                        <select
                          value={selectedApp.status}
                          onChange={(e) =>
                            updateApplicationStatus(selectedApp.id, e.target.value as ApplicationStatus)
                          }
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
                        >
                          {Object.entries(APPLICATION_STATUS_CONFIG).map(([statusKey, cfg]) => (
                            <option key={statusKey} value={statusKey}>
                              {cfg.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Échéance personnelle cible
                        </label>
                        <input
                          type="date"
                          value={selectedApp.personalDeadline ? selectedApp.personalDeadline.split('T')[0] : ''}
                          onChange={(e) =>
                            updateApplicationDetails(selectedApp.id, { personalDeadline: e.target.value })
                          }
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Checklist & Tasks */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <ListTodo className="w-4 h-4 text-blue-600" />
                        Checklist des pièces & démarches ({selectedApp.tasks.filter((t) => t.isCompleted).length}/
                        {selectedApp.tasks.length})
                      </h3>
                    </div>

                    {/* Task items */}
                    <div className="space-y-2">
                      {selectedApp.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-colors ${
                            task.isCompleted
                              ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                              : 'bg-white border-slate-200 text-slate-800 font-medium'
                          }`}
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer flex-1 mr-2">
                            <input
                              type="checkbox"
                              checked={task.isCompleted}
                              onChange={() => toggleApplicationTask(selectedApp.id, task.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                            />
                            <span className="pt-0.5">{task.label}</span>
                          </label>

                          <button
                            onClick={() => deleteApplicationTask(selectedApp.id, task.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Supprimer la tâche"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Task input */}
                    <form onSubmit={(e) => handleAddTask(e, selectedApp.id)} className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newTaskLabel}
                        onChange={(e) => setNewTaskLabel(e.target.value)}
                        placeholder="Ajouter une pièce ou démarche (ex: Demander lettre de recommandation)..."
                        className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={!newTaskLabel.trim()}
                        className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Ajouter
                      </button>
                    </form>
                  </div>

                  {/* Private Notes Section */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        Notes personnelles privées (strictement confidentielles)
                      </h3>
                      {editingNotesAppId !== selectedApp.id && (
                        <button
                          onClick={() => handleStartEditNotes(selectedApp)}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Modifier
                        </button>
                      )}
                    </div>

                    {editingNotesAppId === selectedApp.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={4}
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="Notez ici les contacts pris, questions d'entretien, points à peaufiner..."
                          className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingNotesAppId(null)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleSaveNotes(selectedApp.id)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
                          >
                            Enregistrer les notes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 min-h-[60px] whitespace-pre-wrap">
                        {selectedApp.privateNotes || (
                          <span className="italic text-slate-400">Aucune note pour le moment. Cliquez sur Modifier.</span>
                        )}
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => deleteApplication(selectedApp.id)}
                        className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Retirer cette candidature de mon suivi
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favoriteOpportunities.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Aucun favori enregistré</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Parcourez le catalogue et cliquez sur l'icône de signet pour garder de côté les annonces intéressantes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-blue-700">{opp.organization}</span>
                      <h4
                        onClick={() => onSelectOpportunity(opp)}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-2"
                      >
                        {opp.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => toggleFavorite(opp.id)}
                      className="text-blue-600 p-1 hover:bg-blue-50 rounded"
                      title="Retirer des favoris"
                    >
                      <Bookmark className="w-4 h-4 fill-blue-600" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                    <VerificationBadge status={opp.verificationStatus} size="sm" />
                    <button
                      onClick={() => onSelectOpportunity(opp)}
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      Consulter les critères →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
