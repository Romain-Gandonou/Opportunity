import React from 'react';
import { AlertOctagon, ShieldAlert, CheckCircle2, PhoneCall, Flag, ExternalLink, HelpCircle } from 'lucide-react';

interface ScamPreventionViewProps {
  onOpenReportGeneral: () => void;
}

export const ScamPreventionView: React.FC<ScamPreventionViewProps> = ({ onOpenReportGeneral }) => {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
          <AlertOctagon className="w-4 h-4 text-rose-600" />
          <span>Vigilance Citoyenne</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Prévention des Arnaques & Signalement
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          En Afrique et à l'international, les escroqueries aux faux avis de recrutement et aux bourses fictives font
          des milliers de victimes. Voici le guide pratique pour vous protéger.
        </p>
      </div>

      {/* Red Flags / Signaux d'alarme majeurs */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-200">
          Les 4 Signaux d'Alerte Immanquables (Drapeaux Rouges)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Demande de versement Mobile Money ou bancaire</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              « Frais d'ouverture de dossier », « caution d'hébergement », « taxe d'enregistrement » ou « achat du
              badge ». <strong>Règle d'or :</strong> un organisme international légitime ne demande JAMAIS de virement
              Mobile Money pour postuler.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Adresse e-mail gratuite pour un organisme d'État</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Un prétendu représentant ministériel, onusien ou d'ambassade qui vous écrit depuis un compte{' '}
              <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded">@gmail.com</code> ou{' '}
              <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded">@yahoo.fr</code> est à coup sûr un fraudeur.
              Les organismes officiels utilisent leur propre nom de domaine.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Recrutement ou bourse géré exclusivement par WhatsApp</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Les avis circulant en chaîne WhatsApp avec un numéro individuel à contacter pour « recevoir le lien » sont
              utilisés pour hameçonner les candidats et extorquer leurs données personnelles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Garantie d'admission ou promesse d'obtention</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Aucun organisme sérieux ne garantit l'obtention d'une bourse ou d'un visa en échange d'une somme d'argent.
              Les décisions de bourses d'excellence relèvent de jurys souverains.
            </p>
          </div>
        </div>
      </section>

      {/* Guide Réflexe */}
      <section className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Que faire si vous rencontrez une offre suspecte ?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-blue-700 block text-xs">1. Ne versez aucun fonds</span>
            <p className="text-slate-500">Même pour une somme modique (2 000 ou 5 000 FCFA). Interrompez tout contact.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-blue-700 block text-xs">2. Vérifiez sur Opportunity Trust</span>
            <p className="text-slate-500">
              Recherchez si l'appel d'offres officiel y est répertorié avec son lien canonique.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-blue-700 block text-xs">3. Signalez-le immédiatement</span>
            <p className="text-slate-500">
              Notre équipe d'audit examinera l'élément et préviendra les autres candidats.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            onClick={onOpenReportGeneral}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-colors"
          >
            <Flag className="w-4 h-4" />
            Transmettre un signalement d'annonce suspecte
          </button>
        </div>
      </section>
    </div>
  );
};
