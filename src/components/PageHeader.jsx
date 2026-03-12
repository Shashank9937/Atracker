export const PageHeader = ({ title, description, actions }) => (
  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-brand-500">Founder OS</p>
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
    {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
  </div>
);
