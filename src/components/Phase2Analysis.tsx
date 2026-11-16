import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckSquare, Save, Square } from 'lucide-react';
import { LOCATIONS, LOCATION_MAP, OPINION_STARTERS } from '../game/data';
import { validateEvidenceSelection } from '../game/rules';
import type { GameState, LocationId } from '../game/types';
import { ProfesorCitraPortrait } from './DetectiveArt';

interface Phase2AnalysisProps {
  state: GameState;
  onSaveAnalysis: (
    selectedIds: LocationId[],
    opinionsByLoc: Record<LocationId, string>
  ) => void;
  onBackToHq: () => void;
  onProceedToPhase3: () => void;
}

export function Phase2Analysis({
  state,
  onSaveAnalysis,
  onBackToHq,
  onProceedToPhase3,
}: Phase2AnalysisProps) {
  const [selectedIds, setSelectedIds] = useState<LocationId[]>(state.selectedEvidenceIds);
  const [draftOpinions, setDraftOpinions] = useState<Record<LocationId, string>>({
    kantin: state.opinions.kantin.opinionText,
    kelas: state.opinions.kelas.opinionText,
    perpustakaan: state.opinions.perpustakaan.opinionText,
    taman: state.opinions.taman.opinionText,
  });
  const [error, setError] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);

  const toggleEvidence = (locId: LocationId) => {
    setError('');
    setSavedBanner(false);
    setSelectedIds((prev) => {
      if (prev.includes(locId)) {
        return prev.filter((id) => id !== locId);
      }
      if (prev.length >= 3) {
        setError('Anda hanya boleh memilih maksimum 3 bukti lokasi untuk analisis mendalam.');
        return prev;
      }
      return [...prev, locId];
    });
  };

  const insertStarter = (locId: LocationId, starter: string) => {
    setDraftOpinions((prev) => {
      const current = prev[locId] || '';
      if (current.trim().length === 0) {
        return { ...prev, [locId]: starter };
      }
      return { ...prev, [locId]: `${current.trim()} ${starter}` };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selCheck = validateEvidenceSelection(selectedIds);
    if (!selCheck.valid) {
      setError(selCheck.error || 'Pilih 2 hingga 3 bukti lokasi.');
      return;
    }

    for (const locId of selectedIds) {
      if ((draftOpinions[locId] || '').trim().length < 10) {
        setError(
          `Sila tulis ayat pendapat anda untuk bukti "${LOCATION_MAP[locId].name}" dengan lebih lengkap.`
        );
        return;
      }
    }

    setError('');
    onSaveAnalysis(selectedIds, draftOpinions);
    setSavedBanner(true);
  };

  const canProceed =
    selectedIds.length >= 2 &&
    selectedIds.length <= 3 &&
    selectedIds.every((id) => (state.opinions[id]?.opinionText || '').trim().length >= 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-[#1F362D]">
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
            Fasa 2 · Makmal Analisis Kes
          </h1>
          <p className="text-sm text-[#4A6358]">
            Semak papan bukti di bawah, pilih 2 hingga 3 bukti utama dan bina ayat pendapat anda sendiri.
          </p>
        </div>

        <span className="font-mono-tabular text-sm font-bold text-[#1F362D] bg-[#A9C5AD]/60 px-4 py-2 rounded-xl border border-[#315C4C]/25">
          Bukti Dipilih: {selectedIds.length} / 3 (Minimum 2)
        </span>
      </div>

      {/* Profesor Nurin Guidance — Pastel Green (#A9C5AD) Supporting Section */}
      <div className="bg-[#A9C5AD]/45 rounded-2xl p-5 border border-[#315C4C]/25 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
        <ProfesorCitraPortrait realistic className="w-14 h-14 shrink-0" />
        <p className="text-sm text-[#1F362D] leading-relaxed">
          <strong className="text-[#315C4C]">Profesor Nurin:</strong> “Semua pendapat yang bernas dan
          berasaskan bukti anda diterima. Gunakan rangka bantuan ayat jika perlu, atau tulis ayat
          pendapat anda sendiri secara bebas.”
        </p>
      </div>

      {/* Evidence Board (Papan Bukti) */}
      <section className="bg-[#8C6D51] rounded-2xl p-5 sm:p-6 border-4 border-[#694E37] shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[#F8F5EC]">
          <h2 className="font-display text-xl font-bold">
            Papan Bukti Sekolah Seri Bestari
          </h2>
          <span className="text-xs text-[#E8DFC9]">
            Klik kad untuk memilih bukti (2–3 pilihan)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LOCATIONS.map((loc) => {
            const inv = state.investigations[loc.id];
            const isSelected = selectedIds.includes(loc.id);
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => toggleEvidence(loc.id)}
                aria-pressed={isSelected}
                className={`text-left rounded-xl p-5 border-2 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E7B94F] ${
                  isSelected
                    ? 'bg-[#F8F5EC] border-[#E7B94F] shadow-xl'
                    : 'bg-[#E8DFC9] border-transparent hover:border-[#E7B94F]/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-[#795A40]">
                      {loc.zoneLabel}
                    </p>
                    <h3 className="font-display text-lg font-bold text-[#1F362D]">{loc.name}</h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                      isSelected ? 'text-[#315C4C]' : 'text-[#4A6358]'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckSquare className="w-5 h-5 text-[#315C4C]" />
                        Dipilih
                      </>
                    ) : (
                      <>
                        <Square className="w-5 h-5" />
                        Pilih Bukti
                      </>
                    )}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#2E483E]">
                  <div>
                    <p className="font-semibold text-[#795A40]">Catatan Pemerhatian Murid:</p>
                    <p className="mt-0.5 bg-white rounded-lg p-2.5 border border-[#315C4C]/15">
                      {inv.notes || 'Tiada catatan direkodkan.'}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#795A40]">Cadangan Awal:</p>
                    <p className="mt-0.5 bg-white rounded-lg p-2.5 border border-[#315C4C]/15">
                      {inv.initialProposal || 'Tiada cadangan awal.'}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Open-Ended Opinion Writing Workspace */}
      <form
        onSubmit={handleSave}
        className="bg-[#F8F5EC] rounded-2xl p-6 border border-[#315C4C]/20 shadow-md space-y-5"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#795A40]">
            Penulisan Ayat Pendapat
          </p>
          <h2 className="font-display text-2xl font-bold text-[#315C4C]">
            Hasilkan Pendapat Ejen Berdasarkan Bukti Pilihan
          </h2>
        </div>

        {selectedIds.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#E8DFC9]/55 border border-[#315C4C]/15 text-sm text-[#4A6358]">
            Pilih sekurang-kurangnya 2 kad bukti di atas untuk mula menulis ayat pendapat anda.
          </div>
        ) : (
          <div className="space-y-5">
            {selectedIds.map((locId, index) => {
              const loc = LOCATION_MAP[locId];
              return (
                <div
                  key={locId}
                  className="rounded-xl p-5 bg-[#A9C5AD]/35 border border-[#315C4C]/20 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-[#1F362D]">
                      {index + 1}. Pendapat bagi {loc.name}
                    </h3>
                    <span className="text-xs font-semibold text-[#795A40]">Penulisan bebas</span>
                  </div>

                  {/* Optional Sentence Frame Helpers */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#4A6358]">
                      Permulaan ayat pilihan:
                    </span>
                    {OPINION_STARTERS.map((starter, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => insertStarter(locId, starter)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#315C4C] hover:text-[#F8F5EC] text-[#1F362D] border border-[#315C4C]/20 text-xs transition-colors"
                      >
                        + “{starter.trim()}...”
                      </button>
                    ))}
                  </div>

                  <label htmlFor={`opinion-${locId}`} className="sr-only">
                    Ayat pendapat bagi {loc.name}
                  </label>
                  <textarea
                    id={`opinion-${locId}`}
                    rows={3}
                    value={draftOpinions[locId] || ''}
                    onChange={(e) => {
                      setDraftOpinions((prev) => ({ ...prev, [locId]: e.target.value }));
                      setSavedBanner(false);
                      if (error) setError('');
                    }}
                    placeholder={`Contoh: Pada pendapat saya, pihak sekolah perlu menambah tong sampah di ${loc.name} kerana...`}
                    className="w-full rounded-xl p-3.5 bg-white border-2 border-[#315C4C]/25 focus:border-[#315C4C] focus:outline-none text-sm text-[#1F362D] placeholder-[#7B8B83]"
                  />
                </div>
              );
            })}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-[#FBECE8] border border-[#C2593F] text-sm font-medium text-[#8C331D]"
          >
            {error}
          </div>
        )}

        {savedBanner && (
          <div
            role="status"
            className="p-3.5 rounded-xl bg-[#A9C5AD]/45 border border-[#315C4C]/40 text-sm font-semibold text-[#1F362D]"
          >
            Ayat pendapat telah disimpan ke dalam Kad Keputusan Ejen!
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#315C4C] hover:bg-[#3D6E5C] border-2 border-[#E7B94F] text-[#F8F5EC] font-bold text-sm shadow transition-colors"
          >
            <Save className="w-4 h-4 text-[#E7B94F]" />
            Simpan ke Kad Keputusan Ejen
          </button>

          {canProceed && (
            <button
              type="button"
              onClick={onProceedToPhase3}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E7B94F] hover:bg-[#F2CE74] text-[#1F362D] font-bold text-sm shadow transition-colors"
            >
              Teruskan ke Fasa 3: Buktikan Teori
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
