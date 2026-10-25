import React from 'react';
import { ShieldCheck, CheckCircle2, Search, Link2, AlertTriangle, FileCheck, Lock, Building2 } from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Charte de Fiabilité Opportunity Trust</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Notre Méthode de Vérification
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Sur Internet, des milliers de fausses offres de bourses et d'emplois circulent chaque jour.
          Opportunity Trust applique un protocole d'audit documentaire systématique avant toute mise en avant.
        </p>
      </div>

      {/* The 4 Distinct Levels explained */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-200">
          Les 4 Niveaux de Vérification d'Opportunity Trust
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Level 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                Niveau 1 : Source non vérifiée
              </span>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              L'annonce a été identifiée ou transmise par un utilisateur mais n'a pas encore fait l'objet d'un audit de
              conformité complet. Elle n'apparaît pas dans les sélections recommandées et invite à la plus grande réserve.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4">
              <li>Lien brut collecté</li>
              <li>En attente d'instruction par nos auditeurs</li>
            </ul>
          </div>

          {/* Level 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200">
                Niveau 2 : Source identifiée
              </span>
              <Link2 className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              L'identité apparente de l'organisme émetteur et l'URL source ont été enregistrées et vérifiées dans nos
              registres d'audit. Le domaine correspond à l'organisation annoncée.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4">
              <li>Vérification du nom de domaine et du protocole TLS</li>
              <li>Aucun signalement négatif en cours</li>
            </ul>
          </div>

          {/* Level 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                Niveau 3 : Source contrôlée
              </span>
              <FileCheck className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Les critères d'éligibilité, la date limite de dépôt et les contacts officiels ont été validés directement
              auprès de l'organisme (site officiel ministériel, portail d'ambassade, plateforme universitaire reconnue).
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4">
              <li>Contrôle de la gratuité du processus de sélection</li>
              <li>Validation des critères formels</li>
            </ul>
          </div>

          {/* Level 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Niveau 4 : Informations recoupées
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Plusieurs sources concordantes et indépendantes confirment l'authenticité de l'opportunité (e.g. arrêté
              ministériel officiel au Journal Officiel + portail de candidature Campus France + contact direct validé).
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4">
              <li>Preuves multiples consignées au journal d'audit</li>
              <li>Niveau de confiance maximal</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Protocol of Checks */}
      <section className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Les 5 Règles d'Or de l'Audit Opportunity Trust</h3>
        <ol className="space-y-3 text-xs sm:text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <strong className="text-blue-600 shrink-0">1. Règle de gratuité absolue :</strong>
            <span>
              Aucune opportunité exigeant un versement préalable pour obtenir un formulaire ou passer un test ne reçoit
              de label vérifié.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <strong className="text-blue-600 shrink-0">2. Règle de non-fabrication de date :</strong>
            <span>
              Si la date limite n'est pas spécifiée dans l'appel officiel, elle reste marquée "Date permanente ou non
              spécifiée". Il est formellement interdit d'inventer une date pour créer une fausse urgence.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <strong className="text-blue-600 shrink-0">3. Règle du lien officiel canonique :</strong>
            <span>
              Chaque opportunité renvoie exclusivement vers le site officiel de l'organisme ou vers sa plateforme
              accréditée.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <strong className="text-blue-600 shrink-0">4. Détection et archivage des expirés :</strong>
            <span>
              Dès qu'une échéance confirmée est dépassée, l'opportunité est immédiatement étiquetée "Expirée" avec un
              avertissement de sécurité bien visible.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <strong className="text-blue-600 shrink-0">5. Révocabilité immédiate :</strong>
            <span>
              Tout signalement fondé d'utilisateur ou d'organisme entraîne la suspension conservatoire de l'annonce en
              attendant l'instruction.
            </span>
          </li>
        </ol>
      </section>
    </div>
  );
};
