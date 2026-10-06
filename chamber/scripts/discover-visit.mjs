const DAY = 86400000;

export function visitMessage(previous, now = Date.now()) {
  const timestamp = Number(previous);
  if (previous == null || String(previous).trim() === '' ||
      !Number.isFinite(timestamp) || timestamp < 0 || timestamp > now) {
    return 'Welcome! Let us know if you have any questions.';
  }
  const days = Math.floor((now - timestamp) / DAY);
  return days === 0 ? 'Back so soon! Awesome!' :
    `You last visited ${days} ${days === 1 ? 'day' : 'days'} ago.`;
}
