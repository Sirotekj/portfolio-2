type ButtonProps = {
  children: React.ReactNode;
  label?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  color?: 'light' | 'dark' | 'danger';
  type?: 'button' | 'submit' | 'reset';
};
export default function ButtonAdmin({
  children,
  onClick,
  className,
  disabled,
  color,
  type,
}: ButtonProps) {
  const colorClass =
    color === 'dark'
      ? 'bg-primary text-background border-primary'
      : color === 'danger'
        ? 'border-danger text-danger hover:border-danger-hover hover:text-danger-hover hover:bg-danger/5'
        : 'border-border hover:text-primary hover:border-primary';

  return (
    <button
      type={type ? type : 'button'}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-4 py-2 text-sm font-medium border ${colorClass} transition-opacity cursor-pointer flex items-center hover:opacity-90 text-nowrap [&>svg]:w-10 [&>svg]:h-10 [&>svg]:p-2 ${className ?? ''}`}
    >
      {children}
    </button>
  );
}
