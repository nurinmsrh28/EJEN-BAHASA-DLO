import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  FileSearch,
  KeyRound,
  Lock,
  ShieldCheck,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import {
  loginAgent,
  registerAgentAccount,
  resetAgentPassword,
} from '../game/authClient';
import { validateLoginInput } from '../game/rules';
import type { AuthUser } from '../game/types';
import { AcademyEmblem } from './DetectiveArt';

interface LoginScreenProps {
  onBack: () => void;
  onAuthenticated: (user: AuthUser) => void;
}

const REMEMBERED_USERNAME_KEY = 'ejen_remembered_username_v1';

export function LoginScreen({ onBack, onAuthenticated }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState(() => {
    try {
      return window.localStorage.getItem(REMEMBERED_USERNAME_KEY) || '';
    } catch {
      return '';
    }
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);

  // Password reset modal state
  const [resetUser, setResetUser] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStatus, setResetStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateLoginInput(username, password);
    if (!check.valid) {
      setError(check.error || 'Sila lengkapkan maklumat log masuk anda.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const res =
        mode === 'login'
          ? await loginAgent({ username: username.trim(), password, rememberMe })
          : await registerAgentAccount({ username: username.trim(), password, rememberMe });

      if (!res.ok || !res.user) {
        setError(res.error || 'Pengesahan gagal. Sila semak maklumat anda.');
        return;
      }

      try {
        if (rememberMe) {
          window.localStorage.setItem(REMEMBERED_USERNAME_KEY, username.trim());
        } else {
          window.localStorage.removeItem(REMEMBERED_USERNAME_KEY);
        }
      } catch {
        // Ignore storage errors
      }

      onAuthenticated(res.user);
    } catch {
      setError('Gagal menghubungi pelayan pengesahan. Sila cuba sebentar lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus(null);
    setResetLoading(true);
    try {
      const res = await resetAgentPassword({
        username: resetUser.trim(),
        recoveryCode: recoveryCode.trim(),
        newPassword,
      });
      if (res.ok) {
        setResetStatus({
          type: 'ok',
          text: res.message || 'Kata laluan berjaya ditetapkan semula.',
        });
        setUsername(resetUser.trim());
        setPassword('');
      } else {
        setResetStatus({
          type: 'err',
          text: res.error || 'Gagal menetapkan semula kata laluan.',
        });
      }
    } catch {
      setResetStatus({
        type: 'err',
        text: 'Ralat sambungan pelayan semasa tetapan semula.',
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen paper-canvas text-[#1F362D] flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Minimal Academy Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.045]"
      >
        <AcademyEmblem className="w-[560px] h-[560px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl intro-stage-1">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8F5EC] hover:bg-white border border-[#315C4C]/25 text-xs font-semibold text-[#1F362D] shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#795A40]" />
            Kembali ke Laman Utama
          </button>

          <div className="flex items-center gap-3 text-xs font-mono-tabular text-[#4A6358]">
            <span>FAIL KES: SB-HQ // 2026</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#795A40] font-semibold">DOKUMEN SULIT</span>
          </div>
        </div>

        {/* Main Classic Detective Academy Portal Card */}
        <div className="rounded-2xl bg-[#F8F5EC] border-2 border-[#E7B94F] shadow-[0_22px_50px_rgba(49,92,76,0.16)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Pastel Green (#A9C5AD) Supporting Showcase with Uploaded Portrait */}
          <div className="lg:col-span-5 relative bg-[#A9C5AD] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#315C4C]/20 overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#E7B94F]/25 blur-3xl pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-[#315C4C]/15 blur-3xl pointer-events-none"
            />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#315C4C]/20 pb-3">
                <span className="font-mono-tabular text-[11px] font-bold tracking-[0.18em] uppercase text-[#1F362D]">
                  Sekolah Seri Bestari
                </span>
                <span className="font-mono-tabular text-[10px] font-bold tracking-[0.2em] uppercase text-[#795A40] border border-[#795A40]/55 px-2.5 py-0.5 rounded-sm bg-[#F8F5EC] -rotate-1 whitespace-nowrap shrink-0">
                  DOKUMEN SULIT
                </span>
              </div>

              {/* Circular Mustard-Gold Medallion Frame */}
              <div className="relative mx-auto max-w-[260px] pt-2 flex flex-col items-center gap-3">
                <div className="relative p-2 rounded-full bg-[#F8F5EC] border border-[#E7B94F] shadow-[0_14px_32px_rgba(49,92,76,0.2)] ring-4 ring-[#E7B94F]/30">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-[3px] border-[#E7B94F] bg-[#F8F5EC]">
                    <img
                      src="/assets/aistudio/Professor_Detective_in_the_Investigation_Office_54081002.png"
                      alt="Profesor Nurin — Bilik Penyiasatan Akademi Ejen Rahsia Sekolah Seri Bestari"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center scale-[1.06]"
                    />
                  </div>
                </div>
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#315C4C] border border-[#E7B94F] text-[11px] shadow">
                  <span className="font-semibold text-[#F8F5EC]">Profesor Nurin</span>
                  <span aria-hidden="true" className="text-[#E7B94F]">·</span>
                  <span className="font-mono-tabular text-[#E7B94F] font-semibold">PEMBIMBING HQ</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-5 pt-4 border-t border-[#315C4C]/20 space-y-2">
              <p className="text-xs leading-relaxed text-[#1F362D] font-medium">
                “Setiap anggota penyiasatan mesti mengesahkan kelayakan akses sebelum membuka fail kes
                dan pelan operasi Sekolah Seri Bestari.”
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono-tabular text-[#244639]">
                <FileSearch className="w-3.5 h-3.5 text-[#315C4C]" />
                <span>SISTEM KESELAMATAN AKADEMI · ENKRIPSI SESI AKTIF</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cream (#F8F5EC) Official Member Login Form */}
          <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-between space-y-6 bg-[#F8F5EC]">
            <div className="space-y-4">
              {/* Organization Emblem + Title + Slogan */}
              <div className="flex items-center gap-4 border-b border-[#315C4C]/15 pb-5">
                <AcademyEmblem className="w-14 h-14 shrink-0 drop-shadow-[0_4px_10px_rgba(49,92,76,0.2)]" />
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#795A40]">
                    Sekolah Seri Bestari
                  </p>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#315C4C] tracking-tight">
                    AKADEMI EJEN RAHSIA
                  </h1>
                  <p className="font-mono-tabular text-xs tracking-[0.18em] uppercase text-[#4A6358] mt-0.5">
                    PORTAL AKSES RASMI ANGGOTA
                  </p>
                </div>
              </div>

              {/* Login / Register Mode Switch */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#E8DFC9] border border-[#315C4C]/20">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className={`inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    mode === 'login'
                      ? 'bg-[#315C4C] text-[#F8F5EC] shadow-sm'
                      : 'text-[#315C4C] hover:text-[#1F362D]'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-[#E7B94F]" />
                  Log Masuk Anggota
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className={`inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    mode === 'register'
                      ? 'bg-[#315C4C] text-[#F8F5EC] shadow-sm'
                      : 'text-[#315C4C] hover:text-[#1F362D]'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-[#E7B94F]" />
                  Daftar Akaun Baharu
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-username"
                    className="block text-xs font-bold uppercase tracking-wider text-[#315C4C] mb-1.5"
                  >
                    Nama Pengguna / ID Ejen
                  </label>
                  <input
                    id="login-username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Contoh: ejen.bestari"
                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#315C4C]/25 focus:border-[#315C4C] focus:outline-none text-[#1F362D] placeholder-[#7B8B83] text-sm transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-bold uppercase tracking-wider text-[#315C4C] mb-1.5"
                  >
                    Kata Laluan
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder={
                        mode === 'login'
                          ? 'Masukkan kata laluan rasmi anda'
                          : 'Minimum 6 aksara rahsia'
                      }
                      className="w-full pl-4 pr-12 py-3 rounded-xl bg-white border-2 border-[#315C4C]/25 focus:border-[#315C4C] focus:outline-none text-[#1F362D] placeholder-[#7B8B83] text-sm transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Sembunyikan kata laluan' : 'Paparkan kata laluan'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[#4A6358] hover:bg-[#E8DFC9] hover:text-[#1F362D] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <label className="inline-flex items-center gap-2 text-xs text-[#2E483E] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#315C4C]/40 bg-white accent-[#315C4C]"
                    />
                    <span className="font-semibold tracking-wide">INGAT SAYA</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setResetUser(username);
                      setResetStatus(null);
                      setForgotOpen(true);
                    }}
                    className="text-xs font-semibold text-[#795A40] hover:text-[#315C4C] underline underline-offset-4 transition-colors"
                  >
                    LUPA KATA LALUAN?
                  </button>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-[#FBECE8] border border-[#C2593F] text-xs sm:text-sm font-medium text-[#8C331D] flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 text-[#C2593F] shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#315C4C] hover:bg-[#3D6E5C] disabled:opacity-60 text-[#F8F5EC] border-2 border-[#E7B94F] font-bold text-sm tracking-wider uppercase shadow-[0_10px_22px_rgba(49,92,76,0.22)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <Lock className="w-4 h-4 text-[#E7B94F]" />
                  <span>
                    {submitting
                      ? 'Mengesahkan Akses...'
                      : mode === 'login'
                      ? 'LOG MASUK'
                      : 'DAFTAR & LOG MASUK'}
                  </span>
                </button>
              </form>
            </div>

            {/* Official Demo Reference Slip */}
            <div className="rounded-xl bg-[#E8DFC9]/65 border border-[#E7B94F] p-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-[#795A40]">
                  Slip Akses Demo · Sekolah Seri Bestari
                </p>
                <p className="font-mono-tabular text-xs text-[#2E483E]">
                  ID Ejen: <strong className="text-[#1F362D]">ejen.bestari</strong> · Kata Laluan:{' '}
                  <strong className="text-[#1F362D]">Bestari#2026</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setUsername('ejen.bestari');
                  setPassword('Bestari#2026');
                  setError('');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#E7B94F] hover:bg-[#F2CE74] text-[#1F362D] text-[11px] font-bold transition-colors whitespace-nowrap shadow-sm"
              >
                Isi Akses Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lupa Kata Laluan Modal */}
      {forgotOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-title"
          className="fixed inset-0 z-50 bg-[#315C4C]/45 backdrop-blur-[2px] flex items-center justify-center p-4"
        >
          <div className="dossier-unfold w-full max-w-md rounded-2xl bg-[#F8F5EC] border-2 border-[#E7B94F] p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-[#315C4C]/15 pb-3">
              <div>
                <p className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-[#795A40]">
                  Protokol Pemulihan Akses
                </p>
                <h2 id="forgot-title" className="font-display text-xl font-bold text-[#1F362D]">
                  Tetapkan Semula Kata Laluan
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                aria-label="Tutup tetingkap pemulihan"
                className="p-1.5 rounded-lg text-[#4A6358] hover:bg-[#E8DFC9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-3.5">
              <div>
                <label
                  htmlFor="reset-username"
                  className="block text-xs font-semibold text-[#315C4C] mb-1"
                >
                  Nama Pengguna / ID Ejen
                </label>
                <input
                  id="reset-username"
                  type="text"
                  value={resetUser}
                  onChange={(e) => setResetUser(e.target.value)}
                  placeholder="Contoh: ejen.bestari"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#315C4C]/25 text-sm text-[#1F362D]"
                />
              </div>

              <div>
                <label
                  htmlFor="reset-code"
                  className="block text-xs font-semibold text-[#315C4C] mb-1"
                >
                  Kod Keselamatan Akademi (Kod Rasmi: BESTARI2026)
                </label>
                <input
                  id="reset-code"
                  type="text"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  placeholder="Masukkan kod keselamatan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#315C4C]/25 text-sm text-[#1F362D]"
                />
              </div>

              <div>
                <label
                  htmlFor="reset-new-pw"
                  className="block text-xs font-semibold text-[#315C4C] mb-1"
                >
                  Kata Laluan Baharu (Min. 6 aksara)
                </label>
                <input
                  id="reset-new-pw"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan kata laluan baharu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#315C4C]/25 text-sm text-[#1F362D]"
                />
              </div>

              {resetStatus && (
                <div
                  role="alert"
                  className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2 ${
                    resetStatus.type === 'ok'
                      ? 'bg-[#A9C5AD]/45 border-[#315C4C]/40 text-[#1F362D]'
                      : 'bg-[#FBECE8] border-[#C2593F] text-[#8C331D]'
                  }`}
                >
                  {resetStatus.type === 'ok' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#315C4C] shrink-0" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-[#C2593F] shrink-0" />
                  )}
                  <span>{resetStatus.text}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#E8DFC9] text-xs font-semibold text-[#1F362D]"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#315C4C] hover:bg-[#3D6E5C] text-[#F8F5EC] text-xs font-bold border border-[#E7B94F]"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#E7B94F]" />
                  {resetLoading ? 'Memproses...' : 'Sahkan Tetapan Semula'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
