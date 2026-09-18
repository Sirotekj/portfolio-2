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
      ? 'admin-btn--dark'
      : color === 'danger'
        ? 'admin-btn--danger'
        : 'admin-btn--light';

  return (
    <button
      type={type ? type : 'button'}
      onClick={onClick}
      disabled={disabled}
      className={`admin-btn ${colorClass} ${className ?? ''}`}
    >
      {children}
    </button>
  );
}
