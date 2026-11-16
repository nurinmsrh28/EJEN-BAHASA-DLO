import React from 'react';
import { Award, Compass, FileText, FolderSearch, LogOut, Volume2, VolumeX } from 'lucide-react';
import type { AppScreen, AuthUser, GameState } from '../game/types';
import { getAgentRank, getEarnedBadgeIds } from '../game/rules';
import { AcademyEmblem } from './DetectiveArt';

interface GameHudProps {
  state: GameState;
  authUser: AuthUser | null;
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenEvidenceDrawer: () => void;
  onOpenDecisionDrawer: () => void;
  onToggleSound: () => void;
  onLogout: () => void;
}

export function GameHud({
  state,
  authUser,
  currentScreen,
  onNavigate,
  onOpenEvidenceDrawer,
  onOpenDecisionDrawer,
  onToggleSound,
  onLogout,
}: GameHudProps) {
  const rank = getAgentRank(state.xp, state.finalReportSaved);
  const badgeCount = getEarnedBadgeIds(state).length;
  const displayName = state.profile?.name || authUser?.profile?.name || authUser?.username || 'Ejen Bahasa';
  const subInfo = state.profile?.className || authUser?.organization || 'Sekolah Seri Bestari';

  return (
    <header className="no-print md:sticky md:top-0 z-30 bg-[#315C4C] text-[#F8F5EC] border-b-2 border-[#E7B94F]/75 shadow-[0_6px_20px_rgba(49,92,76,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Agent Identity & Rank */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => onNavigate('hq')}
            aria-label="Kembali ke Pusat Operasi Ejen"
            className="flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7B94F] rounded-lg"
          >
            <AcademyEmblem className="w-10 h-10 shrink-0" />
            <div className="min-w-0">
              <p className="font-display font-bold text-sm sm:text-base truncate text-[#F8F5EC]">
                {displayName}
              </p>
              <p className="text-xs text-[#E7B94F] font-medium truncate">
                {subInfo} · {rank}
              </p>
            </div>
          </button>
        </div>

        {/* Live XP & Badges Readout */}
        <div className="flex items-center gap-5 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#E7B94F] font-semibold uppercase tracking-wider text-xs">
              XP
            </span>
            <span className="font-mono-tabular font-bold text-base text-[#F8F5EC]">
              {state.xp}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#E7B94F]" />
            <span className="font-mono-tabular font-semibold text-[#F8F5EC]">
              {badgeCount}/5 Lencana
            </span>
          </div>
        </div>

        {/* Navigation, Dossier Shortcuts & Logout */}
        <div className="flex items-center gap-2 flex-wrap">
          {currentScreen !== 'hq' && (
            <button
              type="button"
              onClick={() => onNavigate('hq')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#244639] hover:bg-[#3D6E5C] border border-[#E7B94F]/55 text-xs font-semibold text-[#F8F5EC] whitespace-nowrap shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-[#E7B94F]" />
              Pusat Operasi
            </button>
          )}
          <button
            type="button"
            onClick={onOpenEvidenceDrawer}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#244639] hover:bg-[#3D6E5C] border border-[#E7B94F]/55 text-xs font-semibold text-[#F8F5EC] whitespace-nowrap shrink-0"
          >
            <FolderSearch className="w-3.5 h-3.5 text-[#E7B94F]" />
            Fail Bukti
          </button>
          <button
            type="button"
            onClick={onOpenDecisionDrawer}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#244639] hover:bg-[#3D6E5C] border border-[#E7B94F]/55 text-xs font-semibold text-[#F8F5EC] whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-[#E7B94F]" />
            Kad Keputusan
          </button>
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={state.soundEnabled ? 'Bisukan bunyi' : 'Aktifkan bunyi'}
            className="p-2 rounded-lg bg-[#244639] hover:bg-[#3D6E5C] border border-[#E7B94F]/55 text-[#F8F5EC]"
          >
            {state.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#E7B94F]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#A9C5AD]" />
            )}
          </button>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Log keluar daripada akaun ejen"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#244639] hover:bg-[#492920] border border-[#E7B94F]/45 text-xs font-semibold text-[#F8F5EC] whitespace-nowrap shrink-0"
          >
            <LogOut className="w-3.5 h-3.5 text-[#E7B94F]" />
            Log Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
