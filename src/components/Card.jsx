import { cn } from '../utils/cn';

export const Card = ({ className, children }) => <div className={cn('panel-card', className)}>{children}</div>;
