import { AnalyticsSummary } from '../types';

const VISITOR_ID_KEY = 'aylin_visitor_id_v1';
const LAST_VISIT_TIME_KEY = 'aylin_last_visit_track_ts';
const ANALYTICS_API = '/api/analytics.php';

// Obtener o crear UUID persistente para el visitante
export const getVisitorId = (): string => {
  if (typeof window === 'undefined') return 'server_ssr';
  try {
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    return vid;
  } catch {
    return 'v_temp_' + Date.now();
  }
};

// Detección aproximada de país por TimeZone y Locale
const detectClientGeo = (): { code: string; name: string } => {
  if (typeof window === 'undefined') return { code: 'SV', name: 'El Salvador' };
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('El_Salvador')) return { code: 'SV', name: 'El Salvador' };
    if (tz.includes('Guatemala')) return { code: 'GT', name: 'Guatemala' };
    if (tz.includes('Tegucigalpa')) return { code: 'HN', name: 'Honduras' };
    if (tz.includes('Managua')) return { code: 'NI', name: 'Nicaragua' };
    if (tz.includes('Costa_Rica')) return { code: 'CR', name: 'Costa Rica' };
    if (tz.includes('Panama')) return { code: 'PA', name: 'Panamá' };
    if (tz.includes('Mexico') || tz.includes('Cancun') || tz.includes('Tijuana')) return { code: 'MX', name: 'México' };
    if (tz.includes('Bogota')) return { code: 'CO', name: 'Colombia' };
    if (tz.includes('Madrid') || tz.includes('Canary')) return { code: 'ES', name: 'España' };
    if (tz.includes('Buenos_Aires') || tz.includes('Cordoba')) return { code: 'AR', name: 'Argentina' };
    if (tz.includes('Santiago')) return { code: 'CL', name: 'Chile' };
    if (tz.includes('Lima')) return { code: 'PE', name: 'Perú' };
    if (tz.includes('New_York') || tz.includes('Chicago') || tz.includes('Los_Angeles') || tz.includes('Denver')) return { code: 'US', name: 'Estados Unidos' };
    if (tz.includes('Toronto') || tz.includes('Vancouver')) return { code: 'CA', name: 'Canadá' };
    
    // Si el timezone no coincide, usar lenguaje del navegador
    const lang = (navigator.language || '').toLowerCase();
    if (lang.includes('es-sv')) return { code: 'SV', name: 'El Salvador' };
    if (lang.includes('es-mx')) return { code: 'MX', name: 'México' };
    if (lang.includes('es-gt')) return { code: 'GT', name: 'Guatemala' };
    if (lang.includes('es-es')) return { code: 'ES', name: 'España' };
    if (lang.includes('es-co')) return { code: 'CO', name: 'Colombia' };
    if (lang.includes('es')) return { code: 'SV', name: 'El Salvador' };
    if (lang.includes('en-us')) return { code: 'US', name: 'Estados Unidos' };
  } catch {}
  return { code: 'SV', name: 'El Salvador' };
};

// Detección de tipo de dispositivo
const getDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) return 'mobile';
  return 'desktop';
};

// Registrar una visita de página de forma asíncrona no bloqueante
export const trackPageVisit = (customUrl?: string, customTitle?: string): void => {
  if (typeof window === 'undefined') return;
  
  // Evitar trackear páginas de admin internas como visitas de clientes
  const currentHash = window.location.hash.toLowerCase();
  if (currentHash.includes('admin') || currentHash.includes('dashboard')) return;

  const now = Date.now();
  const lastTs = Number(sessionStorage.getItem(LAST_VISIT_TIME_KEY) || '0');
  // Cooldown de 60 segundos por sesión para no duplicar por recargas rápidas
  if (now - lastTs < 60000) return;
  sessionStorage.setItem(LAST_VISIT_TIME_KEY, String(now));

  const visitorId = getVisitorId();
  const geo = detectClientGeo();
  const pageUrl = customUrl || window.location.pathname + window.location.hash;
  const pageTitle = customTitle || document.title || 'Aylin Daniela Flores | Portafolio';
  const referrer = document.referrer || '';
  const deviceType = getDeviceType();

  const payload = {
    visitorId,
    pageUrl,
    pageTitle,
    referrer,
    countryCode: geo.code,
    countryName: geo.name,
    deviceType,
  };

  try {
    fetch(`${ANALYTICS_API}?action=track_visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {}
};

// Registrar un evento o clic interactivo
export const trackEvent = (
  eventName: string,
  eventType: 'button' | 'project' | 'social' | 'modal' | 'download' | 'lang' | 'audio' | 'contact' = 'button',
  eventTarget: string = ''
): void => {
  if (typeof window === 'undefined') return;

  const currentHash = window.location.hash.toLowerCase();
  if (currentHash.includes('admin') || currentHash.includes('dashboard')) return;

  const visitorId = getVisitorId();
  const geo = detectClientGeo();
  const pageUrl = window.location.pathname + window.location.hash;

  const payload = {
    visitorId,
    eventName,
    eventType,
    eventTarget,
    pageUrl,
    countryCode: geo.code,
    countryName: geo.name,
  };

  try {
    fetch(`${ANALYTICS_API}?action=track_click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {}
};

// Obtener estadísticas agregadas para el Dashboard
export const fetchAnalyticsStats = async (range: '7d' | '14d' | '30d' | 'all' = '30d'): Promise<AnalyticsSummary | null> => {
  try {
    const res = await fetch(`${ANALYTICS_API}?action=stats&range=${range}&_t=${Date.now()}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    return {
      totalVisits: Number(data.totalVisits || 0),
      uniqueVisitors: Number(data.uniqueVisitors || 0),
      totalClicks: Number(data.totalClicks || 0),
      visitsToday: Number(data.visitsToday || 0),
      visitsThisWeek: Number(data.visitsThisWeek || 0),
      visitsThisMonth: Number(data.visitsThisMonth || 0),
      byDays: Array.isArray(data.byDays) ? data.byDays : [],
      byCountry: Array.isArray(data.byCountry) ? data.byCountry : [],
      topClicks: Array.isArray(data.topClicks) ? data.topClicks : [],
      recentActivity: Array.isArray(data.recentActivity) ? data.recentActivity : [],
      deviceBreakdown: data.deviceBreakdown || { desktop: 0, mobile: 0, tablet: 0 }
    };
  } catch (err) {
    console.warn('Error fetching analytics stats:', err);
    return null;
  }
};

// Reiniciar datos de analíticas (solo administradores)
export const resetAnalyticsData = async (adminKey: string = 'kinetic-media-2026'): Promise<boolean> => {
  try {
    const res = await fetch(`${ANALYTICS_API}?action=clear&key=${encodeURIComponent(adminKey)}`, {
      method: 'POST'
    });
    return res.ok;
  } catch {
    return false;
  }
};
