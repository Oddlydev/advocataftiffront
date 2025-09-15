interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function SecondaryButton({
  children,
  className,
  ...rest
}: Props) {
  const baseBtn =
    "inline-flex items-center justify-center px-3 py-2.5 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 lg:py-3.5 xl:px-6 xl:py-3.5 text-xs/4 sm:text-sm/tight lg:text-base/6 font-family-sourcecodepro font-medium gap-2 lg:gap-3 transition-all duration-500 ease-in-out cursor-pointer uppercase";

  return (
    <button
      className={`${baseBtn} bg-brand-2-100 text-brand-2-800 rounded-md shadow-sm hover:bg-brand-2-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 focus-visible:outline-0 focus-visible:outline-offset-0 focus-visible:outline-transparent ${className ?? ""}`}
      {...rest}
    >
      {children}
    </button>
  );
}
