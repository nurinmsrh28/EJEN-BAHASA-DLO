import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, Save, XCircle } from 'lucide-react';
import { LOCATION_MAP, LOGIC_CHALLENGES } from '../game/data';
import { areLogicChallengesComplete, isPhase3Complete } from '../game/rules';
import type { GameState, LocationId } from '../game/types';
import { ProfesorCitraPortrait } from './DetectiveArt';

interface Phase3LogicLabProps {
  state: GameState;
  onSelectLogicOption: (challengeId: string, optionId: 'A' | 'B') => void;
  onSaveReasons: (reasons: Record<LocationId, string>) => void;
  onBackToHq: () => void;
  onProceedToPhase4: () => void;
}

export function Phase3LogicLab({
  state,
  onSelectLogicOption,
  onSaveReasons,
  onBackToHq,
  onProceedToPhase4,
}: Phase3LogicLabProps) {
  const [draftReasons, setDraftReasons] = useState<Record<LocationId, string>>({
    kantin: state.opinions.kantin.reasonText,
    kelas: state.opinions.kelas.reasonText,
    perpustakaan: state.opinions.perpustakaan.reasonText,
    taman: state.opinions.taman.reasonText,
  });
  const [error, setError] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const challengesPassed = areLogicChallengesComplete(state);
  const phase3Done = isPhase3Complete(state);

  const handleSubmitReasons = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengesPassed) {
      setError('Sila selesaikan kesemua 3 cabaran Makmal Bukti dengan pilihan alasan yang relevan dahulu.');
      return;
    }

    for (const locId of state.selectedEvidenceIds) {
      if ((draftReasons[locId] || '').trim().length < 10) {
        setError(
          `Sila tulis alasan yang relevan bagi menyokong pendapat anda untuk ${LOCATION_MAP[locId].name}.`
        );
        return;
      }
    }

    setError('');
    onSaveReasons(draftReasons);
    setSavedNotice(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 text-[#1F362D]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#315C4C]/15 pb-4">
        <div className="space-y-1">
          <button
            type="button"
            onClick={onBackToHq}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#795A40] hover:text-[#315C4C] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Pusat Operasi
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#315C4C]">
            Fasa 3 · Buktikan Teori Ejen (Makmal Bukti)
          </h1>
          <p className="text-sm text-[#4A6358]">
            Bezakan alasan yang relevan daripada kenyataan tidak berkaitan, kemudian tulis alasan
            anda sendiri.
          </p>
        </div>
      </div>

      {/* Part A: Evidence Lab Logic Challenges */}
      <section className="space-y-4">
        <div className="bg-[#315C4C] text-[#F8F5EC] rounded-2xl p-5 border-2 border-[#E7B94F] flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-md">
          <ProfesorCitraPortrait realistic className="w-14 h-14 shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[#E7B94F]">
              Bahagian A · Ujian Makmal Bukti (Profesor Nurin)
            </p>
            <p className="text-sm leading-relaxed text-[#F8F5EC]">
              “Pendapat yang kuat mesti disokong oleh alasan yang relevan — iaitu sebab atau kesan
              yang menyokong cadangan anda secara langsung. Uji kefahaman anda pada 3 kes di bawah.”
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {LOGIC_CHALLENGES.map((challenge) => {
            const chosenId = state.logicChallengeAnswers[challenge.id];
            const chosenOpt = challenge.options.find((o) => o.id === chosenId);

            return (
              <div
                key={challenge.id}
                className="bg-[#F8F5EC] rounded-2xl p-6 border border-[#315C4C]/20 shadow-md space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-[#795A40]">
                    {challenge.contextTitle}
                  </p>
                  {chosenOpt && (
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold ${
                        chosenOpt.isRelevant ? 'text-[#315C4C]' : 'text-[#9F432C]'
                      }`}
                    >
                      {chosenOpt.isRelevant ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Alasan Relevan Disahkan
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Kurang Tepat · Cuba Semula
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className="bg-[#E8DFC9]/65 rounded-xl p-4 border border-[#E7B94F]">
                  <p className="text-xs font-semibold text-[#795A40] uppercase">Pendapat:</p>
                  <p className="font-display text-lg font-bold text-[#1F362D] mt-1">
                    “{challenge.opinion}”
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {challenge.options.map((opt) => {
                    const isPicked = chosenId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onSelectLogicOption(challenge.id, opt.id)}
                        className={`text-left rounded-xl p-4 border-2 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E7B94F] ${
                          isPicked
                            ? opt.isRelevant
                              ? 'bg-[#A9C5AD]/55 border-[#315C4C]'
                              : 'bg-[#FBECE8] border-[#C2593F]'
                            : 'bg-white border-[#315C4C]/20 hover:border-[#E7B94F]'
                        }`}
                      >
                        <p className="font-mono-tabular text-xs font-bold text-[#795A40] mb-1">
                          Pilihan {opt.id}
                        </p>
                        <p className="text-sm text-[#1F362D] leading-relaxed">{opt.text}</p>
                      </button>
                    );
                  })}
                </div>

                {chosenOpt && (
                  <div
                    className={`rounded-xl p-4 text-sm flex items-start gap-2.5 ${
                      chosenOpt.isRelevant
                        ? 'bg-[#A9C5AD]/45 text-[#1F362D] border border-[#315C4C]/35'
                        : 'bg-[#FBECE8] text-[#8C331D] border border-[#C2593F]/45'
                    }`}
                  >
                    <HelpCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#795A40]" />
                    <p>{chosenOpt.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Part B: Write Supporting Reasons for Own Opinions */}
      <form
        onSubmit={handleSubmitReasons}
        className="bg-[#F8F5EC] rounded-2xl p-6 border border-[#315C4C]/20 shadow-md space-y-5"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#795A40]">
            Bahagian B · Bina Alasan Ejen Sendiri
          </p>
          <h2 className="font-display text-2xl font-bold text-[#315C4C]">
            Sokong Pendapat Anda Dengan Alasan Yang Relevan
          </h2>
          <p className="text-sm text-[#4A6358] mt-1">
            Jawapan anda bersifat terbuka dan akan disimpan dalam Kad Keputusan Ejen untuk semakan
            guru.
          </p>
        </div>

        <div className="space-y-4">
          {state.selectedEvidenceIds.map((locId, idx) => {
            const loc = LOCATION_MAP[locId];
            const opinion = state.opinions[locId]?.opinionText || '';
            return (
              <div
                key={locId}
                className="rounded-xl p-5 bg-[#A9C5AD]/35 border border-[#315C4C]/20 space-y-3"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#315C4C]">
                    {idx + 1}. {loc.name} · Pendapat Anda:
                  </p>
                  <p className="text-sm font-semibold text-[#1F362D] mt-1">“{opinion}”</p>
                </div>

                <div>
                  <label
                    htmlFor={`reason-${locId}`}
                    className="block text-xs font-bold uppercase tracking-wider text-[#795A40] mb-1.5"
                  >
                    Alasan Relevan Penyokong Pendapat
                  </label>
                  <textarea
                    id={`reason-${locId}`}
                    rows={3}
                    value={draftReasons[locId] || ''}
                    onChange={(e) => {
                      setDraftReasons((prev) => ({ ...prev, [locId]: e.target.value }));
                      setSavedNotice(false);
                      if (error) setError('');
                    }}
                    placeholder="Terangkan sebab atau kesan positif mengapa pendapat ini wajar dilaksanakan..."
                    className="w-full rounded-xl p-3.5 bg-white border-2 border-[#315C4C]/25 focus:border-[#315C4C] focus:outline-none text-sm text-[#1F362D] placeholder-[#7B8B83]"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-[#FBECE8] border border-[#C2593F] text-sm font-medium text-[#8C331D]"
          >
            {error}
          </div>
        )}

        {savedNotice && (
          <div
            role="status"
            className="p-3.5 rounded-xl bg-[#A9C5AD]/45 border border-[#315C4C]/40 text-sm font-semibold text-[#1F362D]"
          >
            Alasan penyokong berjaya disimpan! Studio Arkitek kini terbuka untuk anda.
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#315C4C] hover:bg-[#3D6E5C] border-2 border-[#E7B94F] text-[#F8F5EC] font-bold text-sm shadow transition-colors"
          >
            <Save className="w-4 h-4 text-[#E7B94F]" />
            Simpan Alasan ke Kad Keputusan
          </button>

          {phase3Done && (
            <button
              type="button"
              onClick={onProceedToPhase4}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E7B94F] hover:bg-[#F2CE74] text-[#1F362D] font-bold text-sm shadow transition-colors"
            >
              Buka Cabaran Akhir: Studio Arkitek
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
