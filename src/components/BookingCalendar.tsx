import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight, Lock, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAYS = ['LU', 'MA', 'MI', 'JU', 'VI', 'SÁ', 'DO'];

export const BookingCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [direction, setDirection] = useState<number>(1);
    const [busyDates, setBusyDates] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        fetchBusyDates();
    }, []);

    const fetchBusyDates = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('busy_dates').select('date_str');
        if (!error && data) {
            setBusyDates(data.map((item) => item.date_str));
        }
        setLoading(false);
    };

    const prevMonth = () => {
        setDirection(-1);
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setDirection(1);
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // Cálculo de días del mes (empezando en Lunes)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalSlots = 42; // 6 semanas × 7 días = altura fija siempre
    const endOffset = totalSlots - (startOffset + daysInMonth);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatDateKey = (d: number) => {
        const mm = String(month + 1).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        return `${year}-${mm}-${dd}`;
    };

    const handleDateClick = (day: number) => {
        const formattedText = `${day} de ${MONTHS[month]} de ${year}`;
        const message = `Hola Eze! ¿Cómo estás? Te consulto disponibilidad para contratarte el día *${formattedText}*.`;
        const whatsappUrl = `https://wa.me/5492645857460?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    // Variantes de animación al cambiar de mes
    const monthVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 28 : -28,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -28 : 28,
            opacity: 0,
        }),
    };

    return (
        <section id="disponibilidad" className="relative z-10 py-28 bg-[#0a0a0a] border-t border-white/10 overflow-hidden">

            {/* Trama diagonal muy sutil de fondo para dar textura */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(114deg, rgba(34, 211, 238, 0.14) 0px, rgba(34, 211, 238, 0.14) 1px, transparent 1px, transparent 85px)',
                }}
            />

            {/* Halo ambiental tenue */}
            <div className="hidden lg:block absolute -right-32 top-1/2 -translate-y-1/2 w-[38vw] h-[38vw] bg-[radial-gradient(circle,rgba(79,70,229,0.16)_0%,transparent_70%)] pointer-events-none" />

            <div className="max-w-screen-2xl mx-auto px-6 md:pl-20 md:pr-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">

                    {/* COLUMNA IZQUIERDA (5 cols): Título editorial, bajada y leyenda */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-5 flex flex-col justify-between space-y-6"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-2.5 h-2.5 bg-cyan-400 inline-block" />
                                <span className="text-[11px] font-black uppercase tracking-[0.35em] text-cyan-400">
                                    Agenda &amp; Booking
                                </span>
                            </div>

                            <h2 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-white">
                                FECHAS <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600">
                                    DISPONIBLES
                                </span>
                            </h2>
                        </div>

                        <p className="text-neutral-300 text-sm md:text-base leading-relaxed max-w-md">
                            Seleccioná la fecha de tu evento en el calendario para consultar disponibilidad y coordinar directamente por <strong className="text-white font-bold">WhatsApp</strong>.
                        </p>

                        {/* Tarjeta de referencias / estados */}
                        <div className="border-t border-white/15 pt-6 space-y-3 max-w-sm">
                            <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-600 inline-block" />
                                    <span className="text-white font-bold">Fecha Libre</span>
                                </div>
                                <span className="text-[10px] text-neutral-400">Clic para consultar</span>
                            </div>

                            <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 bg-red-500/25 border border-red-500/70 inline-block" />
                                    <span className="text-neutral-400 font-bold">Fecha Ocupada</span>
                                </div>
                                <span className="text-[10px] text-neutral-500">No disponible</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* COLUMNA DERECHA (7 cols): Calendario Compacto y Estilizado */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-7 flex justify-center lg:justify-end"
                    >
                        <div className="w-full max-w-[500px] bg-[#0d0d11]/95 backdrop-blur-md border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative">

                            {/* Línea superior de acento en degradado */}
                            <div className="h-[3px] w-full bg-gradient-to-r from-cyan-400 via-blue-600 to-violet-700" />

                            {/* Header del Mes con flechas */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
                                <button
                                    onClick={prevMonth}
                                    aria-label="Mes anterior"
                                    className="w-9 h-9 border border-white/15 bg-black/40 flex items-center justify-center text-neutral-300 hover:border-cyan-400 hover:text-cyan-400 active:scale-95 transition-all cursor-pointer"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <div className="overflow-hidden px-4 text-center">
                                    <AnimatePresence mode="wait" custom={direction}>
                                        <motion.h3
                                            key={`${year}-${month}`}
                                            custom={direction}
                                            initial={{ y: direction > 0 ? 12 : -12, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: direction > 0 ? -12 : 12, opacity: 0 }}
                                            transition={{ duration: 0.2, ease: 'easeOut' }}
                                            className="text-base md:text-lg font-black uppercase tracking-[0.25em] text-white"
                                        >
                                            {MONTHS[month]}{' '}
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                                                {year}
                                            </span>
                                        </motion.h3>
                                    </AnimatePresence>
                                </div>

                                <button
                                    onClick={nextMonth}
                                    aria-label="Mes siguiente"
                                    className="w-9 h-9 border border-white/15 bg-black/40 flex items-center justify-center text-neutral-300 hover:border-cyan-400 hover:text-cyan-400 active:scale-95 transition-all cursor-pointer"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            {/* Días de la semana */}
                            <div className="grid grid-cols-7 border-b border-white/10 bg-[#09090c]">
                                {DAYS.map((day) => (
                                    <div
                                        key={day}
                                        className="py-2.5 text-center text-[10px] font-black tracking-[0.2em] text-neutral-500"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Grilla de días con animación direccional */}
                            <div className="p-3 sm:p-4 overflow-hidden min-h-[290px] flex items-center">
                                {loading ? (
                                    <div className="w-full py-16 text-center text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500">
                                        Sincronizando agenda...
                                    </div>
                                ) : (
                                    <AnimatePresence mode="wait" custom={direction}>
                                        <motion.div
                                            key={`${year}-${month}`}
                                            custom={direction}
                                            variants={monthVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                                            className="grid grid-cols-7 gap-1.5 sm:gap-2 w-full"
                                        >
                                            {/* Espacios vacíos iniciales */}
                                            {Array.from({ length: startOffset }).map((_, idx) => (
                                                <div key={`empty-${idx}`} className="aspect-square" />
                                            ))}

                                            {/* Celdas de los días */}
                                            {Array.from({ length: daysInMonth }).map((_, idx) => {
                                                const day = idx + 1;
                                                const dateKey = formatDateKey(day);
                                                const cellDate = new Date(year, month, day);
                                                const isPast = cellDate < today;
                                                const isToday = cellDate.getTime() === today.getTime();
                                                const isBusy = busyDates.includes(dateKey);

                                                if (isPast) {
                                                    return (
                                                        <div
                                                            key={dateKey}
                                                            className="aspect-square border border-white/[0.04] bg-white/[0.01] flex items-center justify-center text-xs font-bold text-neutral-700 select-none"
                                                        >
                                                            {day}
                                                        </div>
                                                    );
                                                }

                                                if (isBusy) {
                                                    return (
                                                        <div
                                                            key={dateKey}
                                                            title="Fecha ocupada"
                                                            className="aspect-square border border-red-500/30 bg-red-950/20 flex flex-col items-center justify-center relative select-none"
                                                        >
                                                            <span className="text-xs sm:text-sm font-black text-red-400/60 line-through">
                                                                {day}
                                                            </span>
                                                            <Lock className="w-2.5 h-2.5 text-red-500/60 mt-0.5" />
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <button
                                                        key={dateKey}
                                                        onClick={() => handleDateClick(day)}
                                                        title={`Consultar disponibilidad el ${day} de ${MONTHS[month]}`}
                                                        className={`aspect-square border flex flex-col items-center justify-center relative group transition-all duration-150 cursor-pointer ${isToday
                                                            ? 'border-cyan-400/70 bg-cyan-500/10'
                                                            : 'border-white/10 bg-[#14141a] hover:border-cyan-400 hover:bg-gradient-to-br hover:from-cyan-500/25 hover:via-blue-600/25 hover:to-violet-600/30'
                                                            }`}
                                                    >
                                                        {/* Puntito indicador de disponibilidad */}
                                                        <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-cyan-400 opacity-70 group-hover:opacity-100" />

                                                        <span className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-300 group-hover:scale-110 transition-all">
                                                            {day}
                                                        </span>

                                                        <ArrowUpRight className="w-2.5 h-2.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1 right-1" />
                                                    </button>
                                                );
                                            })}
                                            {Array.from({ length: endOffset }).map((_, idx) => (
                                                <div key={`end-empty-${idx}`} className="aspect-square" />
                                            ))}
                                        </motion.div>
                                    </AnimatePresence>
                                )}
                            </div>

                            {/* Pie sutil del calendario */}
                            <div className="px-5 py-3 border-t border-white/10 bg-[#09090c] flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                <span className="flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 text-cyan-400" />
                                    Respuesta directa
                                </span>
                                <span className="text-neutral-500">San Juan / Todo el país</span>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};