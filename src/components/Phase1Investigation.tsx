import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Save,
  Search,
} from 'lucide-react';
import { LOCATIONS, LOCATION_MAP } from '../game/data';
import { isPhase1Complete, validateLocationSave } from '../game/rules';
import type { GameState, LocationId } from '../game/types';
import { ProfesorCitraPortrait } from './DetectiveArt';
import { InteractiveLocationScene } from './LocationScenes';

interface Phase1InvestigationProps {
  state: GameState;
  activeLocationId: LocationId;
  onSelectLocation: (locId: LocationId) => void;
  onDiscoverClue: (locId: LocationId, clueId: string) => void;
  onRequestHint: (locId: LocationId, nextLevel: 1 | 2 | 3) => void;
  onSaveLocation: (locId: LocationId, notes: string, initialProposal: string) => void;
  onBackToHq: () => void;
  onProceedToPhase2: () => void;
}

export function Phase1Investigation({
  state,
  activeLocationId,
  onSelectLocation,
  onDiscoverClue,
  onRequestHint,
  onSaveLocation,
  onBackToHq,
  onProceedToPhase2,
}: Phase1InvestigationProps) {
  const loc = LOCATION_MAP[activeLocationId];
  const inv = state.investigations[activeLocationId];

  const [activeClueId, setActiveClueId] = useState<string | null>(null);
  const [notes, setNotes] = useState(inv.notes);
  const [proposal, setProposal] = useState(inv.initialProposal);
  const [error, setError] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setNotes(inv.notes);
    setProposal(inv.initialProposal);
    setActiveClueId(inv.discoveredClueIds[inv.discoveredClueIds.length - 1] || null);
    setError('');
    setSavedNotice(false);
  }, [activeLocationId, inv.notes, inv.initialProposal]);

  const handleClueClick = (clueId: string) => {
    setActiveClueId(clueId);
    setError('');
    onDiscoverClue(activeLocationId, clueId);
  };

  const handleHintClick = () => {
    const nextLevel = Math.min(3, inv.hintLevelUsed + 1) as 1 | 2 | 3;
    onRequestHint(activeLocationId, nextLevel);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateLocationSave(state, activeLocationId, notes, proposal);
    if (!check.valid) {
      setError(check.error || 'Sila lengkapkan maklumat lokasi.');
      return;
    }
    setError('');
    onSaveLocation(activeLocationId, notes.trim(), proposal.trim());
    setSavedNotice(true);
  };

  const activeClue = loc.clues.find((c) => c.id === activeClueId);
  const all4Done = isPhase1Complete(state);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-[#1F362D]">
      {/* Phase Header & Location Switcher */}
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
            Fasa 1 · Operasi Jejak Bukti
          </h1>
        </div>

        {/* 4 Location Tabs */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Pilih lokasi penyiasatan">
          {LOCATIONS.map((item) => {
            const done = state.investigations[item.id].completed;
            const active = item.id === activeLocationId;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectLocation(item.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border-2 transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#315C4C] text-[#F8F5EC] border-[#E7B94F] font-bold shadow'
                    : done
                    ? 'bg-[#A9C5AD]/60 text-[#1F362D] border-[#315C4C]/40 hover:bg-[#A9C5AD]/80'
                    : 'bg-[#F8F5EC] text-[#1F362D] border-[#315C4C]/20 hover:border-[#E7B94F]'
                }`}
              >
                {done && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Investigation Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Visual Scene + 3-Tier Hint System */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#F8F5EC] rounded-2xl p-4 sm:p-5 border border-[#315C4C]/20 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-[#795A40]">
                  {loc.zoneLabel}
                </p>
                <h2 className="font-display text-xl font-bold text-[#315C4C]">
                  Lokasi: {loc.name}
                </h2>
              </div>
              <span className="font-mono-tabular text-xs font-bold text-[#1F362D] bg-[#A9C5AD]/60 px-3 py-1 rounded-lg border border-[#315C4C]/20">
                Petunjuk Ditemui: {inv.discoveredClueIds.length} / {loc.clues.length}
              </span>
            </div>

            <p className="text-sm text-[#4A6358]">{loc.briefing}</p>

            {/* Interactive SVG Scene */}
            <InteractiveLocationScene
              locationId={activeLocationId}
              discoveredClueIds={inv.discoveredClueIds}
              hintLevelUsed={inv.hintLevelUsed}
              activeClueId={activeClueId}
              onSelectClue={handleClueClick}
            />

            <p className="text-xs text-[#4A6358] flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#795A40]" />
              Klik ikon kanta pembesar pada kawasan bermasalah di dalam gambar untuk mengumpul bukti.
            </p>
          </div>

          {/* Profesor Nurin 3-Tier Guidance — Pastel Green (#A9C5AD) Supporting Card */}
          <div className="bg-[#A9C5AD]/45 rounded-2xl p-5 border border-[#315C4C]/25 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ProfesorCitraPortrait realistic className="w-12 h-12 shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#315C4C]">
                    Bimbingan Profesor Nurin
                  </p>
                  <p className="text-xs text-[#2E483E]">
                    Tahap bantuan digunakan: {inv.hintLevelUsed} / 3
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleHintClick}
                disabled={inv.hintLevelUsed >= 3}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E7B94F] hover:bg-[#F2CE74] disabled:opacity-50 text-[#1F362D] text-xs font-bold transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                <Lightbulb className="w-4 h-4" />
                {inv.hintLevelUsed === 0 && 'Minta Petunjuk Tahap 1'}
                {inv.hintLevelUsed === 1 && 'Minta Petunjuk Tahap 2'}
                {inv.hintLevelUsed === 2 && 'Aktifkan Sorotan Visual (Tahap 3)'}
                {inv.hintLevelUsed >= 3 && 'Semua Bantuan Aktif'}
              </button>
            </div>

            {activeClue ? (
              <div className="bg-[#F8F5EC] rounded-xl p-4 border border-[#315C4C]/25 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#315C4C]">
                  Bukti Ditemui: {activeClue.label}
                </p>
                <p className="text-sm font-medium text-[#1F362D]">{activeClue.issueSummary}</p>
                <p className="text-xs text-[#4A6358] italic">
                  Profesor Nurin: “{activeClue.profesorReaction}”
                </p>
              </div>
            ) : (
              <p className="text-sm text-[#1F362D]">
                “Teliti persekitaran {loc.name} dengan cermat. Klik objek yang menunjukkan masalah
                persekitaran.”
              </p>
            )}

            {inv.hintLevelUsed > 0 && (
              <div className="space-y-1.5 pt-1">
                {loc.hints.slice(0, inv.hintLevelUsed).map((hintText, index) => (
                  <p
                    key={index}
                    className="text-xs text-[#1F362D] bg-[#F8F5EC] rounded-lg px-3 py-2 border border-[#E7B94F]"
                  >
                    {hintText}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Discovered Clues Checklist & Student Investigation Notes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#F8F5EC] rounded-2xl p-5 border border-[#315C4C]/20 shadow-md space-y-4">
            <h3 className="font-display text-lg font-bold text-[#315C4C] border-b border-[#315C4C]/15 pb-2">
              Senarai Semak Bukti Lokasi
            </h3>

            <ul className="space-y-2">
              {loc.clues.map((clue) => {
                const found = inv.discoveredClueIds.includes(clue.id);
                return (
                  <li
                    key={clue.id}
                    className={`rounded-xl p-3 border text-sm ${
                      found
                        ? 'bg-[#A9C5AD]/45 border-[#315C4C]/35 text-[#1F362D]'
                        : 'bg-[#E8DFC9]/55 border-[#315C4C]/12 text-[#4A6358]'
                    }`}
                  >
                    <p className="font-semibold flex items-center justify-between gap-2">
                      <span>{found ? clue.label : 'Petunjuk Belum Ditemui'}</span>
                      <span
                        className={`text-xs font-mono-tabular ${
                          found ? 'text-[#315C4C] font-bold' : 'text-[#6A7B73]'
                        }`}
                      >
                        {found ? 'Ditemui' : 'Terkunci'}
                      </span>
                    </p>
                    {found && <p className="text-xs text-[#2E483E] mt-1">{clue.issueSummary}</p>}
                  </li>
                );
              })}
            </ul>

            <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-[#315C4C]/15">
              <div>
                <label
                  htmlFor="notes-textarea"
                  className="block text-sm font-semibold text-[#315C4C] mb-1.5"
                >
                  Catatan Pemerhatian Ejen
                </label>
                <textarea
                  id="notes-textarea"
                  rows={3}
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setSavedNotice(false);
                    if (error) setError('');
                  }}
                  placeholder={`Catatkan masalah yang anda perhatikan di ${loc.name}...`}
                  className="w-full rounded-xl p-3 bg-white border-2 border-[#315C4C]/25 focus:border-[#315C4C] focus:outline-none text-sm text-[#1F362D] placeholder-[#7B8B83]"
                />
              </div>

              <div>
                <label
                  htmlFor="proposal-textarea"
                  className="block text-sm font-semibold text-[#315C4C] mb-1.5"
                >
                  Cadangan Penyelesaian Awal
                </label>
                <textarea
                  id="proposal-textarea"
                  rows={3}
                  value={proposal}
                  onChange={(e) => {
                    setProposal(e.target.value);
                    setSavedNotice(false);
                    if (error) setError('');
                  }}
                  placeholder={`Cadangkan langkah awal untuk menambah baik ${loc.name}...`}
                  className="w-full rounded-xl p-3 bg-white border-2 border-[#315C4C]/25 focus:border-[#315C4C] focus:outline-none text-sm text-[#1F362D] placeholder-[#7B8B83]"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-[#FBECE8] border border-[#C2593F] text-xs font-medium text-[#8C331D]"
                >
                  {error}
                </div>
              )}

              {savedNotice && (
                <div
                  role="status"
                  className="p-3 rounded-xl bg-[#A9C5AD]/45 border border-[#315C4C]/40 text-xs font-semibold text-[#1F362D]"
                >
                  Bukti bagi {loc.name} telah disimpan ke Fail Bukti Ejen!
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#315C4C] hover:bg-[#3D6E5C] border-2 border-[#E7B94F] text-[#F8F5EC] font-bold text-sm shadow transition-colors"
              >
                <Save className="w-4 h-4 text-[#E7B94F]" />
                Simpan Bukti Lokasi
              </button>
            </form>
          </div>

          {all4Done && (
            <div className="bg-[#315C4C] text-[#F8F5EC] rounded-2xl p-5 border-2 border-[#E7B94F] space-y-3 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-wider text-[#E7B94F]">
                Fasa 1 Lengkap (4/4 Lokasi)
              </p>
              <p className="text-sm leading-relaxed text-[#F8F5EC]">
                Syabas, Ejen! Kesemua 4 lokasi telah disiasat. Makmal Analisis Kes kini dibuka.
              </p>
              <button
                type="button"
                onClick={onProceedToPhase2}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#E7B94F] hover:bg-[#F2CE74] text-[#1F362D] font-bold text-sm transition-colors"
              >
                Teruskan ke Fasa 2: Makmal Analisis Kes
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
