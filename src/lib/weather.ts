/** Погода в Астане через Open-Meteo (без API-ключа). */

export interface Weather {
  temperature: number;
  code: number;
  description: string;
  icon: string;
}

const CODES: Record<number, { description: string; icon: string }> = {
  0: { description: "Ясно", icon: "☀️" },
  1: { description: "Почти ясно", icon: "🌤️" },
  2: { description: "Переменная облачность", icon: "⛅" },
  3: { description: "Пасмурно", icon: "☁️" },
  45: { description: "Туман", icon: "🌫️" },
  48: { description: "Изморозь", icon: "🌫️" },
  51: { description: "Морось", icon: "🌦️" },
  61: { description: "Небольшой дождь", icon: "🌧️" },
  63: { description: "Дождь", icon: "🌧️" },
  71: { description: "Небольшой снег", icon: "🌨️" },
  73: { description: "Снег", icon: "❄️" },
  95: { description: "Гроза", icon: "⛈️" },
};

const ASTANA = { lat: 51.1284, lng: 71.4306 };

export async function fetchAstanaWeather(): Promise<Weather | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${ASTANA.lat}&longitude=${ASTANA.lng}&current=temperature_2m,weather_code`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const code: number = data.current.weather_code;
    const meta = CODES[code] ?? { description: "Погода", icon: "🌡️" };
    return {
      temperature: Math.round(data.current.temperature_2m),
      code,
      ...meta,
    };
  } catch {
    return null; // офлайн — просто не показываем погоду
  }
}

export function daysTogether(startDate: string): number {
  const start = new Date(startDate).getTime();
  return Math.max(0, Math.floor((Date.now() - start) / 86_400_000));
}

export function pluralDays(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дня";
  return "дней";
}
