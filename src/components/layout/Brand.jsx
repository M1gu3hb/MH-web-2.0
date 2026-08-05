export function Brand({ compact = false, inverted = false }) {
  return (
    <a
      className={`brand ${compact ? 'brand--compact' : ''} ${inverted ? 'brand--inverted' : ''}`}
      href="#inicio"
      aria-label="MH Astral Systems — Inicio"
    >
      <span className="brand__plate">
        <img src="/mh-logo-sm.png" alt="" width="44" height="40" />
      </span>
      {!compact && (
        <span className="brand__name">
          <strong>MH ASTRAL</strong>
          <small>SYSTEMS</small>
        </span>
      )}
    </a>
  );
}
