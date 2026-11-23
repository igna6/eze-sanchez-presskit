import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Menu, FolderOpen, ArrowUpRight } from 'lucide-react';
import { BookingCalendar } from './components/BookingCalendar';
import { AdminPanel } from './components/AdminPanel';

function App() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');
  const [videos, setVideos] = useState([
    { id: "P5FC2OQJnrI", title: "VENENO DE SERPIENTE X GUARACHETTE - EDIT MASHUP" },
    { id: "Y3wRcOzO39Y", title: "SIX SEVEN X PEGA PEGA - BR EDIT" },
    { id: "gMuZsM7iEc4", title: "OBSESION X DISCOTEKA - EZE SANCHEZ EDIT" }
  ]);

  // 1. Detección de sección activa en el scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'music', 'disponibilidad', 'contacto-directo', 'presskit'];
      const scrollPos = window.scrollY + 250;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Fetch automático de los últimos 3 videos de YouTube
  useEffect(() => {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3DUCUNRHI7U7FgluNBTjrM-KNw')
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          const fetchedVideos = data.items
            .map((item: any) => {
              // Extrae el ID ya sea desde guid ("yt:video:XXXX") o desde link (watch?v= o /shorts/)
              const match = item.link?.match(/(?:v=|\/shorts\/)([a-zA-Z0-9_-]{11})/);
              const videoId = item.guid?.split(':')[2] || (match ? match[1] : null);
              return videoId ? { id: videoId, title: item.title } : null;
            })
            .filter(Boolean)
            .slice(0, 3);

          if (fetchedVideos.length > 0) {
            setVideos(fetchedVideos);
          }
        }
      })
      .catch(err => console.error("Error fetching videos:", err));
  }, []);

  // 3. Vista de Administración (/admin)
  if (window.location.pathname === '/admin') {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-cyan-400 selection:text-black relative font-sans">

      {/* Franja vertical estilo "BIO" */}
      <div className="fixed left-0 top-0 bottom-0 w-12 border-r border-white/10 z-50 flex items-center justify-center bg-[#0a0a0a] hidden md:flex">
        <div className="transform -rotate-90 whitespace-nowrap text-xs tracking-[0.3em] font-bold text-cyan-400">
          EZE SANCHEZ // DJ &amp; PRODUCER
        </div>
      </div>

      {/* Navegación Fija Estilo Editorial con Recuadro Full-Height */}
      <nav className="fixed top-0 left-0 w-full h-20 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="h-full flex items-center justify-between md:justify-start md:pl-12 pr-6 md:pr-12">

          {/* Bloque Cuadrado de Color Full-Height con el Logo */}
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="h-full px-6 md:px-8 bg-gradient-to-b from-cyan-400 via-blue-600 to-violet-700 flex items-center justify-center hover:brightness-110 transition-all duration-200 shrink-0"
          >
            <img
              src="/nav-logo.png"
              alt="Eze Sanchez DJ"
              className="h-9 md:h-11 w-auto object-contain brightness-0 invert"
            />
          </a>

          {/* Enlaces Escritorio Alineados a la Izquierda junto al Logo */}
          <div className="hidden md:flex items-center gap-10 ml-12 uppercase font-black tracking-[0.2em] text-xs">

            <a
              href="#about"
              onClick={() => setActiveSection('about')}
              className={`relative py-2 transition-colors ${activeSection === 'about' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              BIO
              {activeSection === 'about' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500" />
              )}
            </a>

            <a
              href="#music"
              onClick={() => setActiveSection('music')}
              className={`relative py-2 transition-colors ${activeSection === 'music' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              MÚSICA
              {activeSection === 'music' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500" />
              )}
            </a>

            <a
              href="#disponibilidad"
              onClick={() => setActiveSection('disponibilidad')}
              className={`relative py-2 transition-colors ${activeSection === 'disponibilidad' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              FECHAS
              {activeSection === 'disponibilidad' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500" />
              )}
            </a>

            <a
              href="#contacto-directo"
              onClick={() => setActiveSection('contacto-directo')}
              className={`relative py-2 transition-colors ${activeSection === 'contacto-directo' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              CONTACTO
              {activeSection === 'contacto-directo' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-violet-500" />
              )}
            </a>

            <a
              href="#presskit"
              onClick={() => setActiveSection('presskit')}
              className={`relative py-2 transition-colors ${activeSection === 'presskit' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              PRENSA
              {activeSection === 'presskit' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-violet-500" />
              )}
            </a>

          </div>

          {/* Botón Hamburguesa Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
            className="md:hidden w-11 h-11 border border-white/20 bg-white/[0.03] text-white flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </nav>

      {/* Panel Desplegable Móvil (Pantalla Completa) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-xl md:hidden flex flex-col justify-between pt-28 pb-12 px-8 border-b-2 border-violet-500"
          >
            {/* Enlaces grandes estilo póster */}
            <div className="flex flex-col gap-5 mt-2">
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-black uppercase tracking-tighter text-white hover:text-cyan-400 transition-colors border-b border-white/10 pb-3.5 flex items-center justify-between"
              >
                <span>Biografía</span>
                <span className="text-xs font-bold tracking-[0.3em] text-cyan-400">01</span>
              </a>

              <a
                href="#music"
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-black uppercase tracking-tighter text-white hover:text-cyan-400 transition-colors border-b border-white/10 pb-3.5 flex items-center justify-between"
              >
                <span>Música</span>
                <span className="text-xs font-bold tracking-[0.3em] text-sky-400">02</span>
              </a>

              <a
                href="#disponibilidad"
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-black uppercase tracking-tighter text-white hover:text-cyan-400 transition-colors border-b border-white/10 pb-3.5 flex items-center justify-between"
              >
                <span>Fechas</span>
                <span className="text-xs font-bold tracking-[0.3em] text-blue-400">03</span>
              </a>

              <a
                href="#contacto-directo"
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-black uppercase tracking-tighter text-white hover:text-cyan-400 transition-colors border-b border-white/10 pb-3.5 flex items-center justify-between"
              >
                <span>Contacto</span>
                <span className="text-xs font-bold tracking-[0.3em] text-indigo-400">04</span>
              </a>

              <a
                href="#presskit"
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-black uppercase tracking-tighter text-white hover:text-cyan-400 transition-colors border-b border-white/10 pb-3.5 flex items-center justify-between"
              >
                <span>Prensa</span>
                <span className="text-xs font-bold tracking-[0.3em] text-violet-400">05</span>
              </a>
            </div>

            {/* Pie del menú móvil con botón directo a WhatsApp */}
            <div className="flex flex-col gap-4">
              <a
                href="https://wa.me/5492645857460"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 bg-gradient-to-r from-cyan-400 via-blue-600 to-violet-700 text-white font-black uppercase tracking-widest text-xs text-center"
              >
                Contrataciones // WhatsApp
              </a>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-neutral-500 text-center">
                San Juan . Argentina — 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTENEDOR UNIFICADO: HERO + MARQUESINA + BIOGRAFÍA */}
      <div className="relative w-full bg-[#0a0a0a] overflow-hidden">

        {/* BLOQUE GEOMÉTRICO CON DEGRADADO VERTICAL TURQUESA -> AZUL -> VIOLETA */}
        <div
          className="hidden lg:block absolute inset-0 z-0 pointer-events-none overflow-hidden"
          style={{
            clipPath: 'polygon(58% 0, 100% 0, 100% 48%, 62% 100%, 22% 100%, 35% 48%)'
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#22d3ee_0%,#0ea5e9_24%,#3b5bfd_52%,#6d28d9_80%,#1e0b36_100%)]" />

          {/* Halo de luz superior (Turquesa / Cyan Brillante) */}
          <motion.div
            animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] right-[5%] w-[55vw] h-[55vw] bg-[radial-gradient(circle,rgba(34,211,238,0.55)_0%,transparent_65%)] mix-blend-screen"
          />

          {/* Halo de profundidad inferior (Violeta / Púrpura Eléctrico) */}
          <motion.div
            animate={{ opacity: [0.5, 0.85, 0.5], scale: [1.05, 0.95, 1.05] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[5%] left-[20%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(139,92,246,0.55)_0%,transparent_70%)] mix-blend-overlay"
          />
        </div>

        {/* Versión responsive del polígono para móviles/tablets */}
        <div
          className="lg:hidden absolute inset-0 bg-[linear-gradient(180deg,#22d3ee_0%,#2563eb_42%,#6d28d9_78%,#1e0b36_100%)] opacity-90 z-0 pointer-events-none"
          style={{
            clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 10% 100%)'
          }}
        />

        {/* 1. HERO SECTION */}
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-6 md:pl-20 md:pr-12 pt-20 text-center overflow-hidden">

          {/* Líneas diagonales paralelas */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div
              className="absolute top-[6%] left-[44%] w-[1px] h-[42vh] bg-gradient-to-b from-cyan-400 via-blue-500/60 to-transparent origin-top"
              style={{ transform: 'rotate(24deg)' }}
            />
            <div
              className="absolute top-[22%] left-[43.2%] w-[1px] h-[24vh] bg-gradient-to-b from-violet-500/80 to-transparent origin-top"
              style={{ transform: 'rotate(24deg)' }}
            />
          </div>

          {/* Indicador de 3 cuadraditos en el borde derecho */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="hidden md:flex flex-col gap-2.5 fixed right-6 top-28 z-40 pointer-events-none"
          >
            <span className="w-3 h-3 bg-cyan-400 block" />
            <span className="w-3 h-3 border border-indigo-400/80 block" />
            <span className="w-3 h-3 bg-violet-600 block" />
          </motion.div>

          {/* Contenido Principal del Hero */}
          <div className="relative z-10 w-full max-w-screen-2xl mx-auto flex flex-col items-center">

            {/* Micro-etiqueta superior */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 flex items-center gap-3 self-center md:self-start md:ml-[10%]"
            >
              <span className="w-[2px] h-4 bg-cyan-400 inline-block" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-neutral-300">
                PRESSKIT OFICIAL 2026
              </span>
            </motion.div>

            {/* Logo gigante centrado */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full flex justify-center"
            >
              <img
                src="/EZE SANCHEZ DINAMITA 1.png"
                alt="Eze Sanchez Logo"
                className="w-full max-w-[92vw] md:max-w-[1000px] lg:max-w-[1150px] h-auto object-contain brightness-0 invert drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
              />
            </motion.div>

            {/* Subtítulos debajo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-col items-center gap-6"
            >
              <div className="bg-black/85 backdrop-blur-sm border-x-4 border-cyan-400 px-8 py-3">
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-[0.25em] text-white">
                  DJ / Productor Musical
                </h2>
              </div>
            </motion.div>

          </div>

          {/* Ubicación inferior izquierda */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-8 left-6 md:left-20 z-20 flex items-center gap-3"
          >
            <span className="w-3.5 h-3.5 bg-violet-600 inline-block" />
            <p className="text-xs md:text-sm font-black uppercase tracking-[0.35em] text-white">
              San Juan . Argentina
            </p>
          </motion.div>

        </main>

        {/* 1.5 MARQUESINA CINÉTICA (TICKER INFINITO) */}
        <div className="relative z-20 bg-[#0a0a0a] border-y border-white/15 py-5 overflow-hidden select-none">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center">
            {[0, 1, 2, 3].map((loopIndex) => (
              <div key={loopIndex} className="flex items-center shrink-0">
                <span className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mx-6">
                  GUARACHA
                </span>
                <span className="w-2.5 h-2.5 bg-cyan-400 inline-block" />

                <span
                  className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-transparent mx-6"
                  style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.45)' }}
                >
                  REGGAETÓN
                </span>
                <span className="w-2.5 h-2.5 bg-blue-500 inline-block" />

                <span className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mx-6">
                  CACHENGUE
                </span>
                <span className="w-2.5 h-2.5 bg-violet-500 inline-block" />

                <span
                  className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-transparent mx-6"
                  style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.45)' }}
                >
                  TECH HOUSE
                </span>
                <span className="w-2.5 h-2.5 bg-cyan-400 inline-block" />

                <span className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 mx-6">
                  EXCLUSIVE EDITS
                </span>
                <span className="w-2.5 h-2.5 bg-violet-500 inline-block" />
              </div>
            ))}
          </div>
        </div>

        {/* 2. SECCIÓN BIOGRAFÍA (Con entrada lenta y suave) */}
        <section id="about" className="relative z-10 py-28">
          <div className="max-w-screen-2xl mx-auto px-6 md:pl-20 md:pr-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Columna Izquierda: Foto Vertical */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-4"
              >
                <div className="aspect-[3/4] bg-[#111] border border-white/10 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
                  <img
                    src="/bio-eze.jpg"
                    alt="Eze Sanchez DJ"
                    className="w-full h-full object-cover object-top grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-950/40 via-transparent to-cyan-400/10 pointer-events-none" />
                </div>
              </motion.div>

              {/* Columna Central: Nombre Gigante Vertical */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-3 flex items-center justify-center py-8 lg:py-0"
              >
                <div className="flex items-center justify-center gap-3 select-none">
                  <div className="[writing-mode:vertical-rl] rotate-180 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-white/90 leading-relaxed text-center">
                    GUARACHA, REGGAETÓN <br /> CACHENGUE &amp; HOUSE
                  </div>

                  <h2 className="[writing-mode:vertical-rl] rotate-180 text-6xl sm:text-7xl xl:text-[5.5rem] font-black uppercase tracking-tighter leading-[0.82] text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
                    EZE SANCHEZ
                  </h2>
                </div>
              </motion.div>

              {/* Columna Derecha: Textos Alineados a la Derecha e Hitos */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-5 flex flex-col justify-between text-left lg:text-right space-y-6 bg-[#0a0a0a]/80 lg:bg-transparent p-6 lg:p-0 backdrop-blur-sm lg:backdrop-blur-none"
              >
                <p className="text-neutral-200 text-base md:text-lg leading-relaxed drop-shadow">
                  <strong className="text-white font-black">Eze Sanchez</strong> es un <strong className="text-white font-black">DJ y productor musical</strong> oriundo de <strong className="text-white font-black">San Juan, Argentina</strong>. Desde sus inicios en las cabinas locales, ha desarrollado una identidad sonora contundente y reconocible dentro de la escena.
                </p>

                <p className="text-neutral-200 text-base md:text-lg leading-relaxed drop-shadow">
                  Se especializa en <strong className="text-white font-black">ritmos urbanos y electrónicos</strong> —guaracha, reggaetón, cachengue y tech house—, destacándose por su versatilidad en cabina para leer cada pista y mantener la energía al máximo en cada presentación.
                </p>

                <p className="text-neutral-200 text-base md:text-lg leading-relaxed drop-shadow">
                  Uno de los rasgos distintivos de su propuesta es el uso de <strong className="text-white font-black">versiones exclusivas, mashups y edits propios</strong>, potenciados por su faceta como productor. Sus lanzamientos acumulan miles de reproducciones en <strong className="text-white font-black">YouTube y plataformas digitales</strong>.
                </p>

                {/* Bloque de Hitos Numéricos */}
                <div className="pt-8 border-t border-white/20 flex flex-col gap-4">
                  <div className="flex items-center justify-start lg:justify-end gap-6">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-neutral-300">
                      Origen y base operativa
                    </span>
                    <span className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 via-blue-400 to-violet-500 drop-shadow">
                      SAN JUAN
                    </span>
                  </div>

                  <div className="flex items-center justify-start lg:justify-end gap-6">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-neutral-300">
                      Edits &amp; Lanzamientos activos
                    </span>
                    <span className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 via-blue-400 to-violet-500 drop-shadow">
                      2026
                    </span>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

      </div>

      {/* 3. SECCIÓN PRODUCCIONES */}
      <section id="music" className="relative z-10 py-24 bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto px-6 md:pl-20 md:pr-12">

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/20 pb-8"
          >
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
              Últimas <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600">
                Producciones
              </span>
            </h2>
            <div className="mt-4 md:mt-0 text-right uppercase tracking-widest text-sm text-neutral-400">
              Haz clic para reproducir
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10">
            {videos.map((mix, i) => (
              <motion.div
                key={mix.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelectedVideo(mix.id)}
                className="bg-[#111] p-6 border-r border-b md:border-b-0 border-white/10 group cursor-pointer hover:bg-gradient-to-b hover:from-cyan-950/30 hover:to-violet-950/50 transition-all duration-150 relative"
              >
                <div className="aspect-video bg-black mb-4 overflow-hidden relative border border-white/5 flex items-center justify-center">
                  <img
                    src={`https://img.youtube.com/vi/${mix.id}/hqdefault.jpg`}
                    alt={mix.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-200 ease-out"
                  />
                  <div className="absolute w-12 h-12 bg-black/70 group-hover:bg-gradient-to-tr group-hover:from-cyan-400 group-hover:to-violet-600 text-white flex items-center justify-center rounded-full transition-all duration-200">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>
                <h3 className="font-bold text-sm uppercase tracking-tight group-hover:text-cyan-400 transition-colors duration-150 line-clamp-2">
                  {mix.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ventana Modal Flotante */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video bg-black border border-violet-500/40 shadow-[0_0_50px_rgba(124,58,237,0.25)]"
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 bg-gradient-to-r from-cyan-400 to-violet-600 text-white p-2 font-bold hover:from-white hover:to-white hover:text-black transition-colors flex items-center gap-1 uppercase text-xs tracking-widest"
              >
                <X size={18} />
              </button>

              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3.1 SECCIÓN CALENDARIO INTERACTIVO DE DISPONIBILIDAD */}
      <BookingCalendar />

      {/* 3.2 SECCIÓN CONTACTO EDITORIAL (Encima de Material para Prensa) */}
      <section id="contacto-directo" className="relative z-10 bg-[#0a0a0a] border-t border-white/10 overflow-hidden">

        {/* Bloque Geométrico con Degradado Turquesa -> Azul -> Violeta y corte diagonal a la derecha */}
        <div
          className="hidden lg:block absolute inset-0 bg-[linear-gradient(135deg,#0ea5e9_0%,#2563eb_45%,#5b21b6_85%,#2e1065_100%)] z-0 pointer-events-none"
          style={{
            clipPath: 'polygon(0 0, 78% 0, 92% 100%, 0 100%)'
          }}
        />

        {/* Versión móvil/tablet del fondo */}
        <div className="lg:hidden absolute inset-0 bg-[linear-gradient(180deg,#0284c7_0%,#1d4ed8_50%,#4c1d95_100%)] z-0 pointer-events-none" />

        <div className="max-w-screen-2xl mx-auto px-6 md:pl-20 md:pr-12 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl lg:ml-[8%]"
          >
            {/* Título Gigante */}
            <h2 className="text-6xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-white mb-10 select-none">
              CONTACTO
            </h2>

            {/* Tabla / Lista de Contacto con líneas horizontales */}
            <div className="border-t border-white/25 divide-y divide-white/25">

              {/* Fila 1: EMAIL */}
              <a
                href="mailto:ezequielsanchezdj@gmail.com"
                className="py-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-12 group hover:bg-white/[0.04] px-2 transition-colors"
              >
                <span className="w-32 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-white/75 shrink-0">
                  EMAIL
                </span>
                <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white group-hover:translate-x-2 transition-transform duration-200 break-all">
                  ezequielsanchezdj@gmail.com
                </span>
              </a>

              {/* Fila 2: TEL (ARG.) + Botón diagonal WHATSAPP */}
              <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <a
                  href="https://wa.me/5492645857460"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-12 group"
                >
                  <span className="w-32 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-white/75 shrink-0">
                    TEL (ARG.)
                  </span>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white group-hover:translate-x-2 transition-transform duration-200">
                    +54 9 (264) 585-7460
                  </span>
                </a>

                {/* Botón negro inclinado estilo paralelogramo */}
                <a
                  href="https://wa.me/5492645857460"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start md:self-center inline-flex items-center gap-2.5 bg-[#0a0a0a] text-white px-7 py-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors duration-200 shrink-0"
                  style={{
                    clipPath: 'polygon(6% 0%, 100% 0%, 94% 100%, 0% 100%)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z" />
                  </svg>
                  WHATSAPP
                </a>
              </div>

              {/* Fila 3: INSTAGRAM */}
              <a
                href="https://www.instagram.com/ezesanchezdj/"
                target="_blank"
                rel="noopener noreferrer"
                className="py-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-12 group hover:bg-white/[0.04] px-2 transition-colors"
              >
                <span className="w-32 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-white/75 shrink-0">
                  INSTAGRAM
                </span>
                <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white group-hover:translate-x-2 transition-transform duration-200">
                  @ezesanchezdj
                </span>
              </a>

              {/* Fila 4: YOUTUBE */}
              <a
                href="https://www.youtube.com/@ezesanchezdj"
                target="_blank"
                rel="noopener noreferrer"
                className="py-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-12 group hover:bg-white/[0.04] px-2 transition-colors border-b border-white/25"
              >
                <span className="w-32 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-white/75 shrink-0">
                  YOUTUBE
                </span>
                <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white group-hover:translate-x-2 transition-transform duration-200">
                  @ezesanchezdj
                </span>
              </a>

            </div>
          </motion.div>
        </div>
      </section>

      {/* 3.5 SECCIÓN MATERIAL PARA PRENSA (Estilo Póster Centrado + Botón Diagonal) */}
      <section id="presskit" className="relative z-10 py-32 bg-[#0a0a0a] border-t border-white/10 overflow-hidden">

        {/* Trama de líneas diagonales finas en el fondo (sutil en tono violeta/cyan) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: 'repeating-linear-gradient(114deg, rgba(99, 102, 241, 0.25) 0px, rgba(99, 102, 241, 0.25) 1px, transparent 1px, transparent 75px)'
          }}
        />

        <div className="max-w-screen-2xl mx-auto px-6 md:pl-20 md:pr-12 relative z-10 flex flex-col items-center justify-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl flex flex-col items-center"
          >
            {/* Título Masivo Centrado en dos líneas */}
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-10 select-none">
              PRESS &amp; PROMO <br />
              <span className="text-white">MATERIAL</span>
            </h2>

            {/* Botón Ancho con Corte Diagonal que lleva directo a Google Drive */}
            <a
              href="https://drive.google.com/drive/folders/1BavY2lAYbJZf1M5sqUQbEx3rWoaIv_5p"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full max-w-3xl py-5 px-8 md:px-14 bg-gradient-to-r from-violet-700 via-blue-600 to-cyan-400 hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-4 shadow-[0_15px_40px_rgba(37,99,235,0.25)]"
              style={{
                clipPath: 'polygon(2.5% 0%, 100% 0%, 97.5% 100%, 0% 100%)'
              }}
            >
              <FolderOpen className="w-6 h-6 md:w-7 md:h-7 text-white stroke-[2.5]" />
              <span className="text-sm sm:text-lg md:text-2xl font-black uppercase tracking-wider text-white">
                VER MATERIAL EN GOOGLE DRIVE
              </span>
              <ArrowUpRight className="w-6 h-6 md:w-7 md:h-7 text-white stroke-[2.5] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>

          </motion.div>

        </div>
      </section>

      {/* 4. FOOTER MINIMALISTA CENTRADO */}
      <footer id="contact" className="relative z-10 bg-[#0a0a0a] text-white overflow-hidden">

        {/* Línea superior en degradado turquesa -> azul -> violeta */}
        <div className="w-full h-[2px] bg-gradient-to-r from-cyan-400 via-blue-600 to-violet-700" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-screen-2xl mx-auto px-6 md:pl-20 md:pr-12 py-20 flex flex-col items-center justify-center text-center"
        >
          {/* Logo pequeño centrado en blanco */}
          <a href="#" className="mb-10 hover:opacity-80 transition-opacity">
            <img
              src="/EZE SANCHEZ DINAMITA 1.png"
              alt="Eze Sanchez Logo"
              className="h-12 md:h-14 w-auto object-contain brightness-0 invert"
            />
          </a>

          {/* Cuadrados con borde sutil: Instagram, YouTube, WhatsApp */}
          <div className="flex items-center justify-center gap-3 mb-10">

            {/* Instagram */}
            <a
              href="https://www.instagram.com/ezesanchezdj/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-12 h-12 border border-white/15 bg-white/[0.02] text-neutral-300 flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@ezesanchezdj"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-12 h-12 border border-white/15 bg-white/[0.02] text-neutral-300 flex items-center justify-center hover:border-indigo-400 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/5492645857460"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-12 h-12 border border-white/15 bg-white/[0.02] text-neutral-300 flex items-center justify-center hover:border-violet-400 hover:text-violet-400 hover:bg-violet-400/10 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z" />
              </svg>
            </a>

          </div>

          {/* Copyright minimalista */}
          <p className="text-neutral-500 text-xs tracking-wider font-medium">
            © {new Date().getFullYear()} Eze Sanchez — Presskit Oficial
          </p>

        </motion.div>
      </footer>
    </div>
  );
}

export default App;