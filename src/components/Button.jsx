import { cn } from '../utils/cn';

const variants = {
  primary: 'primary-button',
  secondary: 'secondary-button',
  ghost: 'ghost-button',
  danger: 'danger-button',
};

export const Button = ({ className, variant = 'primary', type = 'button', children, ...props }) => (
  <button className={cn(variants[variant], className)} type={type} {...props}>
    {children}
  </button>
);
