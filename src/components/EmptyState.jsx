export const EmptyState = ({ title, copy }) => (
  <div className="rounded-3xl border border-dashed border-slate-200/80 bg-slate-50/60 px-5 py-10 text-center dark:border-slate-700 dark:bg-slate-950/40">
    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{copy}</p>
  </div>
);
