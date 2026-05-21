export function formatAprPercent(value?: string) {
  const raw = String(value || "").trim();
  if (!raw || raw === "-") return "";

  const formatOne = (part: string) => {
    const text = part.trim();
    const match = text.match(/-?\d+(?:\.\d+)?/);
    if (!match) return text;

    const n = Number(match[0]);
    if (!Number.isFinite(n)) return text;

    const percentValue = text.includes("%") || Math.abs(n) >= 1 ? n : n * 100;
    const formatted = percentValue.toLocaleString("en-AE", {
      minimumFractionDigits: percentValue % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });

    return text.replace(match[0], `${formatted}%`).replace(/%%+/g, "%");
  };

  return raw
    .split(/\s*(?:-|to)\s*/i)
    .filter(Boolean)
    .map(formatOne)
    .join(" - ");
}
