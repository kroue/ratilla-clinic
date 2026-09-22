// Two figures, parent (sage, left) and child (teal, right), whose bodies form
// a heart. The darker lens is where they overlap.
const PARENT = "M60 112C30 92 8 74 8 52 8 36 20 28 32 28c14 0 24 10 30 24 5 14 4 38-2 60Z";
const CHILD = "M60 112c-6-22-7-46-2-60 6-14 16-24 30-24 12 0 24 8 24 24 0 22-22 40-52 60Z";

type Props = {
  /** Unique per page instance, used for the clip path id. */
  id: string;
  className?: string;
};

export function LogoMark({ id, className }: Props) {
  const clipId = `rmc-parent-${id}`;
  return (
    <svg className={className} viewBox="6 0 108 114" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipId}>
          <path d={PARENT} />
        </clipPath>
      </defs>
      <path fill="#8FA680" d={PARENT} />
      <path fill="#6B9AA0" d={CHILD} />
      <path fill="#557F78" d={CHILD} clipPath={`url(#${clipId})`} />
      <circle cx="36" cy="13" r="10.5" fill="#8FA680" />
      <circle cx="86" cy="18" r="7.5" fill="#6B9AA0" />
    </svg>
  );
}
