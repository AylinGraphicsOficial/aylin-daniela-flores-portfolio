import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  MousePointerClick,
  Globe2,
  Calendar,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ArrowUpRight,
  Activity,
  Layers,
  Eye,
} from 'lucide-react';
import { AnalyticsSummary } from '../../types';
import { fetchAnalyticsStats, resetAnalyticsData } from '../../utils/analyticsTracker';
import { playClickSound } from '../../utils/audio';

// Helper para banderas emoji según ISO-2
const getCountryFlagEmoji = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const AnalyticsDashboardTab: React.FC = () => {
  const [range, setRange] = useState<'7d' | '14d' | '30d' | 'all'>('30d');
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await fetchAnalyticsStats(range);
      setStats(data);
    } catch {
      setFeedbackMsg({ text: 'Error al consultar métricas del servidor', type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [range]);

  const handleResetMetrics = async () => {
    playClickSound();
    const ok = await resetAnalyticsData();
    setShowClearConfirm(false);
    if (ok) {
      setFeedbackMsg({ text: 'Métricas reiniciadas exitosamente', type: 'success' });
      await loadData(true);
    } else {
      setFeedbackMsg({ text: 'No se pudieron reiniciar las métricas', type: 'error' });
    }
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Encontrar el valor máximo de visitas en un día para escalar las barras del gráfico
  const maxDailyVisits = Math.max(
    ...(stats?.byDays?.map((d) => d.visits) || [1]),
    1
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#76FF03]/10 border border-[#76FF03]/30 text-[#76FF03] text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Métricas en Tiempo Real • Hostinger MySQL
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans uppercase">
            Analíticas de Visitas, Clics &amp; Actividad
          </h2>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            Monitoreo en vivo de audiencia, procedencia por país, visitas diarias, elementos más cliqueados y registro detallado de interacciones en el portafolio.
          </p>
        </div>

        {/* Acciones y Filtros de Rango */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-xl bg-black/40 border border-white/10 p-1">
            {(['7d', '14d', '30d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  playClickSound();
                  setRange(r);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  range === r
                    ? 'bg-[#76FF03] text-black font-bold shadow-md shadow-[#76FF03]/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {r === '7d' ? '7 Días' : r === '14d' ? '14 Días' : r === '30d' ? '30 Días' : 'Todo'}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              playClickSound();
              loadData(true);
            }}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all"
            title="Refrescar métricas ahora"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#76FF03] ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setShowClearConfirm(true);
            }}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs transition-all"
            title="Limpiar registro de métricas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm border ${
            feedbackMsg.type === 'success'
              ? 'bg-[#76FF03]/10 border-[#76FF03]/30 text-[#76FF03]'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Modal de Confirmación de Limpieza */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b140b] border border-red-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">¿Reiniciar todas las métricas?</h3>
            </div>
            <p className="text-sm text-gray-300">
              Esta acción purgará el conteo de visitas y clics registrados en MySQL. Es ideal si deseas comenzar a medir tras concluir las pruebas internas.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetMetrics}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30"
              >
                Sí, Reiniciar Métricas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards: Resumen Principal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Visitas Totales */}
        <div className="p-5 rounded-2xl bg-[#091209]/80 border border-white/10 hover:border-[#76FF03]/40 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#76FF03]/5 rounded-bl-full pointer-events-none group-hover:bg-[#76FF03]/10 transition-colors" />
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs uppercase font-semibold tracking-wider">Visitas Totales</span>
            <div className="p-2 rounded-lg bg-[#76FF03]/10 text-[#76FF03]">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-sans tracking-tight">
            {stats ? stats.totalVisits.toLocaleString() : '—'}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <span className="text-[#76FF03] font-semibold">+{stats?.visitsToday || 0}</span>
            <span>hoy en el sitio</span>
          </div>
        </div>

        {/* Visitantes Únicos */}
        <div className="p-5 rounded-2xl bg-[#091209]/80 border border-white/10 hover:border-[#76FF03]/40 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#76FF03]/5 rounded-bl-full pointer-events-none group-hover:bg-[#76FF03]/10 transition-colors" />
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs uppercase font-semibold tracking-wider">Visitantes Únicos</span>
            <div className="p-2 rounded-lg bg-cyan-400/10 text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-sans tracking-tight">
            {stats ? stats.uniqueVisitors.toLocaleString() : '—'}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <span className="text-cyan-400 font-semibold">{stats?.visitsThisWeek || 0}</span>
            <span>en los últimos 7 días</span>
          </div>
        </div>

        {/* Total Clics */}
        <div className="p-5 rounded-2xl bg-[#091209]/80 border border-white/10 hover:border-[#76FF03]/40 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#76FF03]/5 rounded-bl-full pointer-events-none group-hover:bg-[#76FF03]/10 transition-colors" />
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs uppercase font-semibold tracking-wider">Conteo de Clics</span>
            <div className="p-2 rounded-lg bg-purple-400/10 text-purple-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-sans tracking-tight">
            {stats ? stats.totalClicks.toLocaleString() : '—'}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <span>Interacciones y botones cliqueados</span>
          </div>
        </div>

        {/* Países Alcanzados */}
        <div className="p-5 rounded-2xl bg-[#091209]/80 border border-white/10 hover:border-[#76FF03]/40 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#76FF03]/5 rounded-bl-full pointer-events-none group-hover:bg-[#76FF03]/10 transition-colors" />
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs uppercase font-semibold tracking-wider">Países Alcanzados</span>
            <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400">
              <Globe2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-sans tracking-tight">
            {stats?.byCountry?.length || 0}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <span>Audiencia global y local</span>
          </div>
        </div>
      </div>

      {/* Gráfico y Tendencia por Días */}
      <div className="p-6 rounded-2xl bg-[#091209]/80 border border-white/10 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-[#76FF03]" />
            <h3 className="text-lg font-bold text-white uppercase font-sans">
              Visitas &amp; Clics Día por Día
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#76FF03]" />
              <span>Visitas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-cyan-400" />
              <span>Clics</span>
            </div>
          </div>
        </div>

        {stats?.byDays && stats.byDays.length > 0 ? (
          <div className="pt-6 pb-2">
            <div className="h-56 flex items-end gap-2 md:gap-3 overflow-x-auto pb-4 pt-8">
              {stats.byDays.map((d) => {
                const visitHeight = Math.max(12, Math.round((d.visits / maxDailyVisits) * 100));
                const clicksHeight = Math.max(6, Math.min(100, Math.round((d.clicks / maxDailyVisits) * 80)));
                const dateFormatted = d.date.slice(5); // MM-DD

                return (
                  <div
                    key={d.date}
                    className="flex-1 min-w-[38px] flex flex-col items-center justify-end h-full group relative"
                  >
                    {/* Tooltip Hover */}
                    <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-black/95 text-white text-[11px] px-2.5 py-1.5 rounded-lg border border-white/20 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                      <div className="font-bold text-[#76FF03]">{d.date}</div>
                      <div>Visitas: {d.visits} ({d.uniqueVisitors} únicos)</div>
                      <div className="text-cyan-400">Clics: {d.clicks}</div>
                    </div>

                    {/* Barras Apiladas / Dobles */}
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Barra de Visitas */}
                      <div
                        style={{ height: `${visitHeight}%` }}
                        className="w-1/2 max-w-[14px] bg-gradient-to-t from-[#38B000] to-[#76FF03] rounded-t-md transition-all group-hover:brightness-125 shadow-sm shadow-[#76FF03]/20"
                      />
                      {/* Barra de Clics */}
                      <div
                        style={{ height: `${clicksHeight}%` }}
                        className="w-1/2 max-w-[14px] bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-md transition-all group-hover:brightness-125 shadow-sm shadow-cyan-400/20"
                      />
                    </div>

                    <span className="text-[10px] text-gray-400 mt-2 font-mono group-hover:text-white transition-colors">
                      {dateFormatted}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-44 flex items-center justify-center text-gray-500 text-sm">
            No hay registros de visitas en el período seleccionado.
          </div>
        )}
      </div>

      {/* Grid: Países y Top Clics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por País */}
        <div className="p-6 rounded-2xl bg-[#091209]/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white uppercase font-sans">
                Procedencia por País
              </h3>
            </div>
            <span className="text-xs text-gray-400">
              {stats?.byCountry?.length || 0} países detectados
            </span>
          </div>

          <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {stats?.byCountry && stats.byCountry.length > 0 ? (
              stats.byCountry.map((item, idx) => (
                <div key={item.countryCode} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{getCountryFlagEmoji(item.countryCode)}</span>
                      <span className="font-semibold text-gray-200">{item.countryName}</span>
                      <span className="text-[10px] text-gray-500 uppercase font-mono">({item.countryCode})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{item.visits}</span>
                      <span className="text-gray-400 text-[11px]">({item.percentage}%)</span>
                    </div>
                  </div>
                  {/* Barra de progreso */}
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, item.percentage)}%` }}
                      className={`h-full rounded-full ${
                        idx === 0
                          ? 'bg-[#76FF03]'
                          : idx === 1
                          ? 'bg-cyan-400'
                          : idx === 2
                          ? 'bg-amber-400'
                          : 'bg-gray-400'
                      }`}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 py-6 text-center">Sin datos de países aún.</p>
            )}
          </div>
        </div>

        {/* Top Clics y Elementos Populares */}
        <div className="p-6 rounded-2xl bg-[#091209]/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <MousePointerClick className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white uppercase font-sans">
                Conteo de Clics en Elementos
              </h3>
            </div>
            <span className="text-xs text-gray-400">Acciones más frecuentes</span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {stats?.topClicks && stats.topClicks.length > 0 ? (
              stats.topClicks.map((click, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="truncate">
                      <span className="font-semibold text-gray-200 block truncate">{click.eventName}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide">{click.eventType}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 font-bold text-white flex-shrink-0 ml-2">
                    {click.count} clics
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 py-6 text-center">No se registran clics todavía.</p>
            )}
          </div>
        </div>
      </div>

      {/* Dispositivos y Registro de Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Desglose de Dispositivos */}
        <div className="p-6 rounded-2xl bg-[#091209]/80 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white uppercase font-sans">
              Dispositivos
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            {[
              {
                label: 'Escritorio (PC / Mac)',
                count: stats?.deviceBreakdown?.desktop || 0,
                icon: Monitor,
                color: 'text-[#76FF03]',
                bg: 'bg-[#76FF03]',
              },
              {
                label: 'Móvil (Smartphones)',
                count: stats?.deviceBreakdown?.mobile || 0,
                icon: Smartphone,
                color: 'text-cyan-400',
                bg: 'bg-cyan-400',
              },
              {
                label: 'Tablet (iPads / Tabs)',
                count: stats?.deviceBreakdown?.tablet || 0,
                icon: Tablet,
                color: 'text-amber-400',
                bg: 'bg-amber-400',
              },
            ].map((d) => {
              const total =
                (stats?.deviceBreakdown?.desktop || 0) +
                (stats?.deviceBreakdown?.mobile || 0) +
                (stats?.deviceBreakdown?.tablet || 0);
              const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
              const Icon = d.icon;

              return (
                <div key={d.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${d.color}`} />
                      <span className="text-gray-300">{d.label}</span>
                    </div>
                    <span className="font-bold text-white">{pct}% ({d.count})</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div style={{ width: `${pct}%` }} className={`h-full rounded-full ${d.bg}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Registro de Actividades en Vivo (Live Feed) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#091209]/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#76FF03]" />
              <h3 className="text-base font-bold text-white uppercase font-sans">
                Registro de Actividades Recientes
              </h3>
            </div>
            <span className="text-xs text-gray-400">Últimos eventos registrados</span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((act) => {
                const isVisit = act.type === 'visit';
                return (
                  <div
                    key={act.id}
                    className="flex items-start justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs transition-all gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 mt-0.5 ${
                          isVisit
                            ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {isVisit ? 'Visita' : 'Clic'}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-200 truncate">{act.title || 'Evento'}</p>
                        {act.detail && <p className="text-[11px] text-gray-400 truncate">{act.detail}</p>}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center justify-end gap-1.5 text-gray-300 font-medium">
                        <span>{getCountryFlagEmoji(act.countryCode)}</span>
                        <span>{act.countryName || 'Global'}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono block">
                        {act.createdAt?.slice(11, 19) || act.createdAt}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-500 py-8 text-center">No hay registros recientes aún.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
