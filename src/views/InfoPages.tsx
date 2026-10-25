import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudyLevel, OpportunityCategory } from '../types';
import { STUDY_LEVEL_LABELS, CATEGORY_LABELS } from '../utils/formatters';
import {
  ShieldCheck,
  Mail,
  MapPin,
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  HelpCircle,
  FileText,
  User,
  AlertTriangle,
  Globe,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          À propos d'Opportunity Trust
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Bâtir l'infrastructure de confiance pour l'accès aux bourses d'excellence, financements et emplois en Afrique
          francophone et à l'international.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-5 leading-relaxed">
        <div className="p-6 bg-blue-50/60 rounded-2xl border border-blue-100">
          <h2 className="text-base font-bold text-blue-950 mb-2">Notre Point de Départ : Le Bénin</h2>
          <p>
            Chaque année, des dizaines de milliers d'étudiants et de jeunes diplômés béninois et ouest-africains
            recherchent activement des opportunités pour poursuivre leurs études ou développer leur carrière. Malheureusement,
            la multiplication de groupes non modérés sur les réseaux sociaux favorise l'escroquerie et la désinformation.
          </p>
          <p className="mt-2">
            Opportunity Trust est né d'un constat d'urgence : offrir un guichet unique, rigoureux, neutre et documenté,
            où chaque opportunité publiée répond à des critères stricts de traçabilité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Transparence Radicale</h3>
            <p className="text-xs text-slate-600">
              Aucune annonce n'est publiée sans son URL d'origine et la méthode exacte employée pour son contrôle.
            </p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Zéro Intermédiaire Payant</h3>
            <p className="text-xs text-slate-600">
              L'accès à l'information et aux outils de suivi de candidatures est entièrement gratuit pour les candidats.
            </p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Protection des Données</h3>
            <p className="text-xs text-slate-600">
              Vos candidatures, notes privées et checklists ne sont jamais vendues ou partagées à des tiers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HelpView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Opportunity Trust est-il un organisme qui attribue directement des bourses ?',
      a: 'Non. Opportunity Trust est une plateforme indépendante de découverte, de vérification documentaire et d’assistance au suivi de candidatures. Les décisions finales d’admission ou d’attribution appartiennent souverainement aux organismes émetteurs (ministères, universités, fondations, bailleurs de fonds).',
    },
    {
      q: 'Comment être certain qu’une opportunité est authentique ?',
      a: 'Consultez le badge de vérification sur chaque annonce : le niveau "Source contrôlée" ou "Informations recoupées" indique que notre équipe d’audit a vérifié le nom de domaine officiel, le texte d’appel d’offres et s’est assurée qu’aucun frais illicite n’est réclamé.',
    },
    {
      q: 'Que faire si l’on me demande des frais de dossier par Mobile Money ?',
      a: 'N’effectuez aucun versement ! Les programmes officiels de bourses d’État (Bénin DBSU, Campus France, DAAD, Mastercard Foundation...) ne passent jamais par des transferts Mobile Money privés. Utilisez notre bouton "Signaler" pour nous alerter immédiatement.',
    },
    {
      q: 'Mes notes personnelles et mes candidatures sont-elles privées ?',
      a: 'Absolument. Conformément au principe d’isolation stricte de notre architecture, vos notes et l’état de vos démarches ne sont accessibles que par vous-même depuis votre session.',
    },
    {
      q: 'Comment exporter mes données personnelles enregistrées sur le site ?',
      a: 'Rendez-vous dans votre onglet "Profil & Confidentialité" et cliquez sur "Exporter mes données (JSON)". Un fichier structuré contenant votre profil et vos candidatures sera instantanément téléchargé.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Centre d'aide & FAQ</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Réponses transparentes aux questions fréquentes des candidats et des organisations
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full text-left p-4 text-xs sm:text-sm font-bold text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <span>{faq.q}</span>
              <span className="text-slate-400 font-normal shrink-0">{openFaq === idx ? '−' : '+'}</span>
            </button>
            {openFaq === idx && (
              <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ContactView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('question');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contactez notre équipe</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Vous êtes un organisme émetteur, une université ou un candidat ayant une question ? Écrivez-nous.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-emerald-200 shadow-2xs space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Message transmis avec succès</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Notre équipe vous répondra sous 24 à 48 heures ouvrées à l'adresse indiquée ({email}).
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Votre nom *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Christian Houenou"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Votre e-mail *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Objet de votre demande *</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="question">Question sur une opportunité</option>
              <option value="partnership">Partenariat institutionnel / Référencement d'appels</option>
              <option value="scam">Signalement d'une arnaque avérée</option>
              <option value="press">Presse & Médias</option>
              <option value="other">Autre demande</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Message détaillé *</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Expliquez votre demande avec le maximum de précision..."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Envoyer le message
          </button>
        </form>
      )}
    </div>
  );
};

export const PrivacyView: React.FC = () => {
  const { currentUser, exportUserData } = useApp();

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Politique de Confidentialité & Protection des Données
      </h1>
      <p className="text-xs text-slate-500">
        Conforme à la Loi N° 2017-20 portant Code du Numérique en République du Bénin et aux standards internationaux (RGPD).
      </p>

      <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900">1. Principes de Minimisation</h2>
        <p>
          Opportunity Trust ne collecte que les informations strictement nécessaires à la personnalisation de vos
          recherches (niveau d'études, domaine, compétences). Aucun document bancaire ou numéro d'identification
          national n'est jamais requis sur notre plateforme.
        </p>

        <h2 className="text-sm font-bold text-slate-900">2. Droit à la Portabilité des Données</h2>
        <p>
          Vous pouvez à tout moment exporter l'ensemble de vos données (profil, candidatures enregistrées, checklists,
          favoris) au format ouvert standard JSON.
        </p>

        {currentUser && (
          <div className="pt-2 pb-2">
            <button
              onClick={exportUserData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Télécharger l'export complet de mes données (JSON)
            </button>
          </div>
        )}

        <h2 className="text-sm font-bold text-slate-900">3. Droit à l'Effacement (Droit à l'oubli)</h2>
        <p>
          Vous pouvez demander à tout moment la suppression intégrale et définitive de votre compte et de toutes les
          candidatures associées depuis votre espace profil.
        </p>
      </div>
    </div>
  );
};

export const TermsView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Conditions Générales d'Utilisation
      </h1>
      <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900">1. Rôle et Limite de Responsabilité</h2>
        <p>
          Opportunity Trust est une plateforme informative d'indexation et d'audit documentaire. Opportunity Trust n'est
          ni un cabinet de recrutement, ni une institution accordant des financements. Nous ne garantissons en aucun cas
          l'admission, le recrutement ou l'octroi d'un visa.
        </p>

        <h2 className="text-sm font-bold text-slate-900">2. Respect des Conditions des Organismes</h2>
        <p>
          Les candidats sont tenus de respecter scrupuleusement les règlements propres à chaque organisme émetteur
          référencé. Les liens externes officiels renvoient vers les plateformes respectives desdits organismes.
        </p>

        <h2 className="text-sm font-bold text-slate-900">3. Interdiction des Comportements Frauduleux</h2>
        <p>
          Toute tentative d'usurpation d'identité d'un organisme, de publication d'annonces avec demande de frais illicites
          ou de diffusion de contenus malveillants est systématiquement signalée aux autorités judiciaires compétentes.
        </p>
      </div>
    </div>
  );
};

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile, exportUserData, deleteAccount } = useApp();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [country, setCountry] = useState(currentUser?.countryOfResidence || 'Bénin');
  const [educationLevel, setEducationLevel] = useState<StudyLevel>(currentUser?.educationLevel || 'master');
  const [fieldOfStudy, setFieldOfStudy] = useState(currentUser?.fieldOfStudy || '');
  const [skillsStr, setSkillsStr] = useState(currentUser?.skills?.join(', ') || '');
  const [notifDeadlines, setNotifDeadlines] = useState(
    currentUser?.notificationPreferences?.deadlineReminders ?? true
  );

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    updateProfile({
      displayName: displayName.trim(),
      countryOfResidence: country,
      educationLevel,
      fieldOfStudy: fieldOfStudy.trim(),
      skills,
      notificationPreferences: {
        ...currentUser.notificationPreferences,
        deadlineReminders: notifDeadlines,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profil & Confidentialité
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Gérez vos critères d'éligibilité et vos droits sur vos données personnelles
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Vos modifications ont été enregistrées avec succès.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Nom d'affichage</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Adresse e-mail</label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Niveau d'études</label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value as StudyLevel)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
            >
              {Object.entries(STUDY_LEVEL_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Pays de résidence</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">Domaine d'études ou de spécialité</label>
          <input
            type="text"
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
            placeholder="Ex : Informatique, Droit, Économie, Agronomie..."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">Compétences clés (séparées par des virgules)</label>
          <input
            type="text"
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
            placeholder="Ex : Python, Anglais C1, Gestion de projet..."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
          />
        </div>

        <div className="pt-2 border-t border-slate-100">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={notifDeadlines}
              onChange={(e) => setNotifDeadlines(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Recevoir des rappels automatiques avant les échéances (J-7, J-3, J-1)</span>
          </label>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Mettre à jour mon profil
          </button>
        </div>
      </form>

      {/* Data Export & Account Deletion (GDPR / Loi béninoise) */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Droits de l'utilisateur sur ses données</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Conformément aux dispositions de protection de la vie privée, vous pouvez télécharger une copie intégrale de
          vos données ou supprimer définitivement votre compte.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={exportUserData}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            Exporter mes données personnelles (JSON)
          </button>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Supprimer définitivement mon compte
          </button>
        </div>
      </div>

      {/* Account Deletion Confirmation Dialog */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h4 className="text-base font-bold text-slate-900">Confirmer la suppression du compte</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cette action est irréversible. Toutes vos candidatures suivies, checklists et préférences seront
                définitivement supprimées de notre base de données.
              </p>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  deleteAccount();
                  setDeleteModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
