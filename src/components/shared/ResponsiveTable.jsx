/**
 * Horizontally scrollable table wrapper for mobile.
 * Parent layouts should use min-w-0 on flex children so overflow-x-auto works.
 */
export default function ResponsiveTable({ children, minWidth = 'min-w-[720px]' }) {
  return (
    <div className="rounded-2xl border border-[#2d1f4e] bg-[#1a0f2e] shadow-sm">
      <div className="overflow-x-auto overscroll-x-contain rounded-2xl [-webkit-overflow-scrolling:touch]">
        <table className={`w-full ${minWidth}`}>
          {children}
        </table>
      </div>
    </div>
  );
}
