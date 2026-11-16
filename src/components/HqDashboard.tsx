import React, { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Download,
  FileCode2,
  FileText,
  FolderSearch,
  Lock,
  LogOut,
  MapPin,
  RotateCcw,
  ShieldCheck,
  UserCog,
  X,
} from 'lucide-react';
import { BADGES, LOCATIONS } from '../game/data';
import {
  getAgentRank,
  getCompletedLocationsCount,
  getEarnedBadgeIds,
  getOverallProgressPercent,
  getUnlockedPhaseLevel,
  isPhase1Complete,
  isPhase2Complete,
  isPhase3Complete,
  isPhase4Complete,
} from '../game/rules';
import type { AppScreen, AuthUser, GameState, LocationId } from '../game/types';
import { AgentIdCard } from './AgentIdCard';
import { BadgeIconSvg, ProfesorCitraPortrait } from './DetectiveArt';

interface HqDashboardProps {
  state: GameState;
  authUser: AuthUser;
  onNavigatePhase: (screen: AppScreen, locationId?: LocationId) => void;
  onOpenEvidenceDrawer: () => void;
  onOpenDecisionDrawer: () => void;
  onExportJson: () => void;
  onResetGame: () => void;
  onLogout: () => void;
}

export function HqDashboard({
  state,
  authUser,
  onNavigatePhase,
  onOpenEvidenceDrawer,
  onOpenDecisionDrawer,
  onExportJson,
  onResetGame,
  onLogout,
}: HqDashboardProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [idModalOpen, setIdModalOpen] = useState(false);
  const completedCount = getCompletedLocationsCount(state);
  const unlockedLevel = getUnlockedPhaseLevel(state);
  const progressPercent = getOverallProgressPercent(state);
  const earnedBadges = getEarnedBadgeIds(state);
  const rank = getAgentRank(state.xp, state.finalReportSaved);

  const activeProfile = state.profile || authUser.profile;
  const displayName = activeProfile?.name || authUser.username;
  const agentRef = activeProfile?.agentId || authUser.referenceNo;

  const handleContinueAdventure = () => {
    if (unlockedLevel === 1) {
      const nextLoc = LOCATIONS.find((l) => !state.investigations[l.id].completed) || LOCATIONS[0];
      onNavigatePhase('phase1', nextLoc.id);
    } else if (unlockedLevel === 2) {
      onNavigatePhase('phase2');
    } else if (unlockedLevel === 3) {
      onNavigatePhase('phase3');
    } else if (unlockedLevel === 4) {
      onNavigatePhase('phase4');
    } else {
      onNavigatePhase('phase5');
    }
  };

  const phases = [
    {
      level: 1,
      screen: 'phase1' as AppScreen,
      title: 'Fasa 1 · Operasi Jejak Bukti',
      desc: 'Siasat 4 lokasi di Sekolah Seri Bestari dan kumpulkan bukti persekitaran.',
      status: isPhase1Complete(state)
        ? 'Selesai (4/4 Lokasi)'
        : `${completedCount}/4 Lokasi Selesai`,
      unlocked: true,
      done: isPhase1Complete(state),
    },
    {
      level: 2,
      screen: 'phase2' as AppScreen,
      title: 'Fasa 2 · Makmal Analisis Kes',
      desc: 'Pilih 2–3 bukti utama di papan penyiasatan dan bina ayat pendapat anda.',
      status: isPhase2Complete(state)
        ? 'Selesai'
        : isPhase1Complete(state)
        ? 'Terbuka'
        : 'Terkunci · Selesaikan Fasa 1',
      unlocked: isPhase1Complete(state),
      done: isPhase2Complete(state),
    },
    {
      level: 3,
      screen: 'phase3' as AppScreen,
      title: 'Fasa 3 · Buktikan Teori Ejen',
      desc: 'Kuasai cabaran alasan relevan dan tuliskan hujah sokongan bagi pendapat anda.',
      status: isPhase3Complete(state)
        ? 'Selesai'
        : isPhase2Complete(state)
        ? 'Terbuka'
        : 'Terkunci · Selesaikan Fasa 2',
      unlocked: isPhase2Complete(state),
      done: isPhase3Complete(state),
    },
    {
      level: 4,
      screen: 'phase4' as AppScreen,
      title: 'Cabaran Akhir · Studio Arkitek',
      desc: 'Reka Pelan Sekolah Impian dengan School Builder dan pautkan justifikasi bukti.',
      status: isPhase4Complete(state)
        ? 'Selesai'
        : isPhase3Complete(state)
        ? 'Terbuka'
        : 'Terkunci · Selesaikan Fasa 3',
      unlocked: isPhase3Complete(state),
      done: isPhase4Complete(state),
    },
    {
      level: 5,
      screen: 'phase5' as AppScreen,
      title: 'Produk Akhir · Laporan Sekolah Impian',
      desc: 'Tulis laporan pendapat 3–5 ayat, pratonton dan cetak hasil rasmi.',
      status: state.finalReportSaved
        ? 'Selesai · Laporan Disimpan'
        : isPhase4Complete(state)
        ? 'Terbuka'
        : 'Terkunci · Selesaikan Studio Arkitek',
      unlocked: isPhase4Complete(state),
      done: state.finalReportSaved,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-[#1F362D]">
      {/* Top HQ Command Center Card — Cream (#F8F5EC) with Forest Green (#315C4C) Crest Header */}
      <section className="relative rounded-2xl bg-[#F8F5EC] border-2 border-[#E7B94F] shadow-[0_18px_44px_rgba(49,92,76,0.14)] overflow-hidden">
        {/* Top Forest Green (#315C4C) Operational Clearance Strip */}
        <div className="bg-[#315C4C] px-6 py-3.5 border-b-2 border-[#E7B94F]/75 flex flex-wrap items-center justify-between gap-3 text-[#F8F5EC]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-mono-tabular text-xs font-bold uppercase tracking-wider text-[#1F362D] bg-[#E7B94F] px-3 py-1 rounded shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1F362D]" />
              {authUser.accessStatus}
            </span>
            <span className="font-mono-tabular text-xs text-[#E7B94F] font-semibold">
              {authUser.organization}
            </span>
            <span aria-hidden="true" className="text-[#A9C5AD]/65">·</span>
            <span className="font-mono-tabular text-xs text-[#F8F5EC]">
              NO. RUJUKAN: <strong>{agentRef}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#244639] hover:bg-[#492920] border border-[#E7B94F]/55 text-xs font-bold text-[#F8F5EC] transition-colors whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5 text-[#E7B94F]" />
            LOG KELUAR
          </button>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
          {/* Left Identity & Command Summary */}
          <div className="lg:col-span-8 space-y-5">
            {/* Greeting + Uploaded Profile Avatar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <ProfesorCitraPortrait
                realistic
                className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 shadow-[0_10px_24px_rgba(49,92,76,0.2)]"
              />
              <div className="space-y-1.5">
                <p className="font-mono-tabular text-xs font-bold uppercase tracking-[0.18em] text-[#795A40]">
                  FAIL KES: OP-SB-2026 · {activeProfile?.codenameBadge || 'Anggota Penyiasat'} ·{' '}
                  {rank}
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#315C4C] leading-tight">
                  SELAMAT KEMBALI, EJEN!
                </h1>
                <p className="text-sm sm:text-base text-[#2E483E]">
                  Anggota Aktif:{' '}
                  <strong className="text-[#1F362D]">{displayName}</strong>
                  {activeProfile?.className ? ` · Kelas ${activeProfile.className}` : ''} — Kemajuan
                  operasi kini pada tahap{' '}
                  <strong className="text-[#315C4C] font-mono-tabular">{progressPercent}%</strong>.
                </p>
              </div>
            </div>

            {/* Operational Progress Bar */}
            <div className="max-w-xl space-y-1.5">
              <div className="flex justify-between text-xs font-mono-tabular text-[#4A6358]">
                <span>Kemajuan Keseluruhan Operasi</span>
                <span className="text-[#315C4C] font-bold">{progressPercent}%</span>
              </div>
              <div className="h-3 rounded-full bg-[#E8DFC9] border border-[#315C4C]/20 overflow-hidden">
                <div
                  className="h-full bg-[#E7B94F] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Primary & Dossier Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleContinueAdventure}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#315C4C] hover:bg-[#3D6E5C] border-2 border-[#E7B94F] text-[#F8F5EC] font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 whitespace-nowrap shrink-0"
              >
                Sambung Pengembaraan
                <ArrowRight className="w-4 h-4 text-[#E7B94F]" />
              </button>

              <button
                type="button"
                onClick={() => onNavigatePhase('profile')}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#E7B94F] hover:bg-[#F2CE74] text-[#1F362D] text-sm font-bold shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                <UserCog className="w-4 h-4" />
                {activeProfile?.agentId ? 'Kemaskini Identiti Ejen' : 'Daftar Identiti Ejen'}
              </button>

              {activeProfile?.agentId && (
                <button
                  type="button"
                  onClick={() => setIdModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#795A40] hover:bg-[#8E6A4C] text-[#F8F5EC] text-sm font-semibold shadow-sm whitespace-nowrap shrink-0"
                >
                  <BadgeCheck className="w-4 h-4 text-[#E7B94F]" />
                  Kad Identiti Digital
                </button>
              )}

              <button
                type="button"
                onClick={onOpenEvidenceDrawer}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#A9C5AD]/45 hover:bg-[#A9C5AD]/70 border border-[#315C4C]/25 text-sm font-semibold text-[#1F362D] whitespace-nowrap shrink-0 transition-colors"
              >
                <FolderSearch className="w-4 h-4 text-[#315C4C]" />
                Fail Bukti Ejen
              </button>

              <button
                type="button"
                onClick={onOpenDecisionDrawer}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#A9C5AD]/45 hover:bg-[#A9C5AD]/70 border border-[#315C4C]/25 text-sm font-semibold text-[#1F362D] whitespace-nowrap shrink-0 transition-colors"
              >
                <FileText className="w-4 h-4 text-[#315C4C]" />
                Kad Keputusan Ejen
              </button>
            </div>
          </div>

          {/* Right Operational Status & Mentor Brief Panel — Pastel Green (#A9C5AD) Supporting Section */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-xl bg-[#A9C5AD]/55 border border-[#315C4C]/25 p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#315C4C]/15 pb-2.5">
                <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-[#315C4C]">
                  Panel Status Operasi
                </span>
                <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-widest text-[#795A40] border border-[#795A40]/50 px-2 py-0.5 rounded-sm bg-[#F8F5EC]">
                  DOKUMEN SULIT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-lg bg-[#F8F5EC] p-2.5 border border-[#315C4C]/15">
                  <p className="text-[#4A6358] text-[10px] uppercase font-mono-tabular">Lokasi</p>
                  <p className="font-mono-tabular font-bold text-[#1F362D] text-sm mt-0.5">
                    {completedCount} / 4 Selesai
                  </p>
                </div>
                <div className="rounded-lg bg-[#F8F5EC] p-2.5 border border-[#315C4C]/15">
                  <p className="text-[#4A6358] text-[10px] uppercase font-mono-tabular">Lencana</p>
                  <p className="font-mono-tabular font-bold text-[#795A40] text-sm mt-0.5">
                    {earnedBadges.length} / {BADGES.length} Aktif
                  </p>
                </div>
              </div>

              <div className="pt-1 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#315C4C]">
                  Arahan Profesor Nurin
                </p>
                <p className="text-xs sm:text-sm text-[#1F362D] leading-relaxed">
                  {unlockedLevel === 1 &&
                    `Pilih mana-mana daripada 4 lokasi di Peta Operasi untuk memulakan penyiasatan (${completedCount}/4 selesai).`}
                  {unlockedLevel === 2 &&
                    'Keempat-empat lokasi telah selesai disiasat! Buka Makmal Analisis Kes untuk memilih bukti terbaik.'}
                  {unlockedLevel === 3 &&
                    'Ayat pendapat anda sangat baik! Uji kekuatan alasan dalam Buktikan Teori Ejen.'}
                  {unlockedLevel === 4 &&
                    'Semua bukti dan hujah lengkap. Masuk ke Studio Arkitek untuk merancang Pelan Sekolah Impian!'}
                  {unlockedLevel === 5 &&
                    'Pelan Sekolah Impian telah dibina. Lengkapkan Laporan Sekolah Impian sebagai produk akhir!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Split: Peta Operasi Sekolah (Left) & Status Penyelesaian Misi (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Peta Operasi Sekolah Seri Bestari */}
        <section className="lg:col-span-7 bg-[#F8F5EC] rounded-2xl p-6 border border-[#315C4C]/20 shadow-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#315C4C]/15 pb-3">
            <div>
              <p className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-[#795A40]">
                FAIL KES · Peta Operasi Sekolah Seri Bestari
              </p>
              <h2 className="font-display text-2xl font-bold text-[#315C4C]">
                Empat Lokasi Penyiasatan
              </h2>
            </div>
            <span className="font-mono-tabular text-sm font-semibold text-[#1F362D] bg-[#A9C5AD]/60 px-3 py-1 rounded-lg border border-[#315C4C]/15">
              {completedCount} / 4 Lokasi Selesai
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-[#315C4C]/15 bg-[#E8DFC9]/70 p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LOCATIONS.map((loc) => {
                const inv = state.investigations[loc.id];
                const cluesFound = inv.discoveredClueIds.length;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => onNavigatePhase('phase1', loc.id)}
                    className={`text-left rounded-xl p-4 border-2 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7B94F] ${
                      inv.completed
                        ? 'bg-[#A9C5AD]/55 border-[#315C4C] shadow-sm'
                        : 'bg-[#F8F5EC] border-[#E7B94F]/75 hover:border-[#315C4C] hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono-tabular text-[#4A6358]">
                        {loc.zoneLabel}
                      </span>
                      {inv.completed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#315C4C]">
                          <CheckCircle2 className="w-4 h-4 text-[#315C4C]" />
                          Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#795A40]">
                          <MapPin className="w-4 h-4 text-[#E7B94F]" />
                          Siasat
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#1F362D]">{loc.name}</h3>
                    <p className="text-xs text-[#4A6358] mt-1 line-clamp-2">{loc.briefing}</p>
                    <p className="font-mono-tabular text-xs font-semibold text-[#315C4C] mt-3">
                      Petunjuk ditemui: {cluesFound}/{loc.clues.length}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Status Penyelesaian Misi (5 Fasa) */}
        <section className="lg:col-span-5 bg-[#F8F5EC] rounded-2xl p-6 border border-[#315C4C]/20 shadow-md space-y-4">
          <div className="border-b border-[#315C4C]/15 pb-3">
            <p className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-[#795A40]">
              Rantaian Operasi
            </p>
            <h2 className="font-display text-2xl font-bold text-[#315C4C]">
              Status Penyelesaian Misi
            </h2>
          </div>

          <div className="space-y-3">
            {phases.map((p) => (
              <div
                key={p.level}
                className={`rounded-xl p-4 border transition-colors ${
                  p.done
                    ? 'bg-[#A9C5AD]/45 border-[#315C4C]/40'
                    : p.unlocked
                    ? 'bg-[#E8DFC9]/60 border-[#E7B94F]'
                    : 'bg-[#EFE8D6]/70 border-[#315C4C]/12 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-display text-base font-bold text-[#1F362D]">{p.title}</h3>
                    <p className="text-xs text-[#4A6358] leading-relaxed">{p.desc}</p>
                    <p
                      className={`text-xs font-semibold pt-1 ${
                        p.done
                          ? 'text-[#315C4C]'
                          : p.unlocked
                          ? 'text-[#795A40]'
                          : 'text-[#6A7B73]'
                      }`}
                    >
                      {p.status}
                    </p>
                  </div>

                  {p.unlocked ? (
                    <button
                      type="button"
                      onClick={() =>
                        onNavigatePhase(p.screen, p.level === 1 ? LOCATIONS[0].id : undefined)
                      }
                      className="px-3.5 py-2 rounded-lg bg-[#315C4C] hover:bg-[#3D6E5C] text-[#F8F5EC] border border-[#E7B94F]/60 text-xs font-bold whitespace-nowrap shrink-0 transition-colors"
                    >
                      {p.done ? 'Semak' : 'Buka'}
                    </button>
                  ) : (
                    <span
                      aria-label="Fasa terkunci"
                      className="p-2 rounded-lg bg-[#F8F5EC] border border-[#315C4C]/15 text-[#6A7B73] shrink-0"
                    >
                      <Lock className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Badges & Data Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <section className="lg:col-span-8 bg-[#F8F5EC] rounded-2xl p-6 border border-[#315C4C]/20 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#315C4C]/15 pb-3">
            <div>
              <p className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-[#795A40]">
                Rekod Pencapaian
              </p>
              <h2 className="font-display text-xl font-bold text-[#315C4C]">Lencana Ejen</h2>
            </div>
            <span className="font-mono-tabular text-xs font-semibold text-[#315C4C]">
              {earnedBadges.length} / {BADGES.length} Diperoleh
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BADGES.map((badge) => {
              const earned = earnedBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`rounded-xl p-3.5 border flex items-start gap-3 ${
                    earned
                      ? 'bg-[#A9C5AD]/50 border-[#E7B94F]'
                      : 'bg-[#E8DFC9]/55 border-[#315C4C]/15 opacity-80'
                  }`}
                >
                  <BadgeIconSvg badgeId={badge.id} earned={earned} className="w-11 h-11 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-[#1F362D]">{badge.name}</p>
                    <p className="text-xs text-[#4A6358] leading-snug">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Data & Export Card */}
        <section className="lg:col-span-4 bg-[#F8F5EC] rounded-2xl p-6 border border-[#795A40]/35 shadow-md space-y-4">
          <div>
            <p className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-[#795A40]">
              Fail Rekod & Arkib Kes
            </p>
            <h2 className="font-display text-xl font-bold text-[#315C4C]">Pengurusan Data</h2>
          </div>
          <p className="text-xs text-[#4A6358] leading-relaxed">
            Kemajuan anda disimpan secara automatik dalam storan setempat pelayar. Gunakan pilihan di
            bawah untuk mengeksport rekod atau memuat turun versi fail HTML kendiri.
          </p>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onExportJson}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#A9C5AD]/45 hover:bg-[#A9C5AD]/70 border border-[#315C4C]/25 text-[#1F362D] text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4 text-[#315C4C]" />
              Eksport Rekod Murid (JSON)
            </button>

            <a
              href="/EJEN_BAHASA.html"
              download="EJEN_BAHASA.html"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#315C4C] hover:bg-[#3D6E5C] text-[#F8F5EC] border border-[#E7B94F]/70 text-xs font-semibold transition-colors"
            >
              <FileCode2 className="w-4 h-4 text-[#E7B94F]" />
              Muat Turun Fail Kendiri (EJEN_BAHASA.html)
            </a>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FBECE8] hover:bg-[#F7DCD5] text-[#9F432C] border border-[#C2593F]/40 text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Tetapkan Semula Operasi
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-[#FBECE8] border border-[#C2593F] space-y-2">
                <p className="text-xs font-semibold text-[#1F362D]">
                  Adakah anda pasti mahu memadam semua bukti dan memulakan operasi semula?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmReset(false);
                      onResetGame();
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#C2593F] text-white text-xs font-semibold"
                  >
                    Ya, Padam
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#315C4C]/20 text-[#1F362D] text-xs font-semibold"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Digital Agent Identity Card Modal */}
      {idModalOpen && activeProfile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Kad Identiti Rasmi Ejen"
          className="fixed inset-0 z-50 bg-[#315C4C]/45 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="w-full max-w-4xl space-y-3">
            <div className="no-print flex justify-end">
              <button
                type="button"
                onClick={() => setIdModalOpen(false)}
                aria-label="Tutup Kad Identiti"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F8F5EC] border border-[#315C4C]/25 text-xs font-semibold text-[#1F362D] shadow hover:bg-white"
              >
                <X className="w-4 h-4 text-[#795A40]" />
                Tutup
              </button>
            </div>
            <AgentIdCard profile={activeProfile} rankLabel={rank} />
          </div>
        </div>
      )}
    </div>
  );
}
