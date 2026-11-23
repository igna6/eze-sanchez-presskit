import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ChevronLeft, ChevronRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const DAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

export const AdminPanel: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState('');

    const [currentDate, setCurrentDate] = useState(new Date());
    const [busyDates, setBusyDates] = useState<string[]>([]);
    const [savingDate, setSavingDate] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState('');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        // Mantener sesión abierta mientras no cierre la pestaña
        if (sessionStorage.getItem('eze_admin_auth') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchBusyDates();
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'eze2026';
        if (passwordInput === expectedPassword) {
            setIsAuthenticated(true);
            sessionStorage.setItem('eze_admin_auth', 'true');
            setAuthError('');
        } else {
            setAuthError('Contraseña incorrecta');
        }
    };

    const fetchBusyDates = async () => {
        const { data, error } = await supabase.from('busy_dates').select('date_str');
        if (!error && data) {
            setBusyDates(data.map((item) => item.date_str));
        }
    };

    const toggleDateStatus = async (dateKey: string) => {
        setSavingDate(dateKey);
        const isCurrentlyBusy = busyDates.includes(dateKey);

        if (isCurrentlyBusy) {
            const { error } = await supabase.from('busy_dates').delete().eq('date_str', dateKey);
            if (error) {
                console.error('Error al liberar fecha:', error);
                showToast(`Error: ${error.message}`);
            } else {
                setBusyDates((prev) => prev.filter((d) => d !== dateKey));
                showToast(`Fecha ${dateKey} liberada`);
            }
        } else {
            const { error } = await supabase.from('busy_dates').insert([{ date_str: dateKey }]);
            if (error) {
                console.error('Error al guardar fecha:', error);
                showToast(`Error: ${error.message}`);
            } else {
                setBusyDates((prev) => [...prev, dateKey]);
                showToast(`Fecha ${dateKey} marcada como OCUPADA`);
            }
        }
        setSavingDate(null);
    };

    const showToast = (msg: string) => {
        setStatusMessage(msg);
        setTimeout(() => setStatusMessage(''), 2500);
    };

    // Pantalla de Login
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6 font-sans">
                <div className="w-full max-w-md border border-white/15 bg-[#0e0e12] p-8 md:p-10 relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-600 to-violet-600" />

                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white mb-8"
                    >
                        <ArrowLeft size={14} /> Volver al sitio
                    </a>

                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
                        Panel de Gestión
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-neutral-400 mb-8">
                        Administración de Fechas — Eze Sanchez
                    </p>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-neutral-300 mb-2">
                                Contraseña de acceso
                            </label>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#0a0a0a] border border-white/20 px-4 py-3.5 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                                autoFocus
                            />
                        </div>

                        {authError && (
                            <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                                {authError}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-cyan-400 via-blue-600 to-violet-700 text-white font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all cursor-pointer"
                        >
                            Ingresar al Calendario
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Pantalla de Edición de Calendario
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* Top bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/15">
                    <div>
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 hover:underline mb-2"
                        >
                            <ArrowLeft size={14} /> Ver web pública
                        </a>
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                            Editor de Disponibilidad
                        </h1>
                    </div>

                    {statusMessage && (
                        <div className="inline-flex items-center gap-2 bg-cyan-500/15 border border-cyan-400/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                            <CheckCircle2 size={16} />
                            {statusMessage}
                        </div>
                    )}
                </div>

                <p className="text-sm text-neutral-300 mb-6">
                    Hacé clic en cualquier fecha para alternar entre <strong className="text-emerald-400">DISPONIBLE</strong> y <strong className="text-red-500">OCUPADO</strong>. Los cambios se guardan automáticamente.
                </p>

                {/* Calendario interactivo Admin */}
                <div className="border border-white/15 bg-[#0e0e12]">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/15 bg-[#121218]">
                        <button
                            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                            className="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-cyan-400"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <h2 className="text-xl font-black uppercase tracking-widest">
                            {MONTHS[month]} <span className="text-violet-400">{year}</span>
                        </h2>

                        <button
                            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                            className="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-cyan-400"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 border-b border-white/15 bg-[#0a0a0a]">
                        {DAYS.map((day) => (
                            <div key={day} className="py-3 text-center text-xs font-black tracking-widest text-neutral-400 border-r last:border-r-0 border-white/10">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">
                        {Array.from({ length: startOffset }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="aspect-square md:aspect-[4/3] border-r border-b border-white/10 bg-[#08080a]" />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                            const day = idx + 1;
                            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isBusy = busyDates.includes(dateKey);
                            const isSaving = savingDate === dateKey;

                            return (
                                <button
                                    key={dateKey}
                                    disabled={isSaving}
                                    onClick={() => toggleDateStatus(dateKey)}
                                    className={`aspect-square md:aspect-[4/3] border-r border-b border-white/10 p-3 flex flex-col justify-between text-left transition-all cursor-pointer ${isBusy
                                        ? 'bg-red-600/25 hover:bg-red-600/35 border-red-500/40'
                                        : 'bg-[#111] hover:bg-emerald-500/15'
                                        }`}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span className={`text-lg font-black ${isBusy ? 'text-red-400' : 'text-white'}`}>
                                            {day}
                                        </span>
                                        {isBusy ? (
                                            <Lock className="w-4 h-4 text-red-400" />
                                        ) : (
                                            <Unlock className="w-4 h-4 text-emerald-400/50" />
                                        )}
                                    </div>

                                    <span
                                        className={`text-[9px] font-black uppercase tracking-widest ${isBusy ? 'text-red-400' : 'text-emerald-400'
                                            }`}
                                    >
                                        {isSaving ? 'GUARDANDO...' : isBusy ? 'OCUPADO' : 'LIBRE'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};