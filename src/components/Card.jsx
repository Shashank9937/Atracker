import { cn } from '../utils/cn';

export const Card = ({ className, children, ...props }) => (
  <div className={cn('panel-card', className)} {...props}>
    {children}
  </div>
);
