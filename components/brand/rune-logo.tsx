interface RuneLogoProps {
  className?: string;
  size?: number;
}

export function RuneLogo({ className = "", size = 28 }: RuneLogoProps) {
  return (
    <svg
      width={size * 3.4}
      height={size}
      viewBox="0 0 170 50"
      className={className}
      role="img"
      aria-label="RUNE"
    >
      <text
        x="0"
        y="38"
        fontFamily="ui-monospace, 'SF Mono', 'Geist Mono', monospace"
        fontSize="42"
        fontWeight="900"
        letterSpacing="-3"
        fill="currentColor"
      >
        RUNE
      </text>
    </svg>
  );
}
