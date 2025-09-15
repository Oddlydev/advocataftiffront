import Link from "next/link";

interface Props {
  children: React.ReactNode;
  href?: string;
  query?: Record<string, string | number | boolean | undefined>;
  onClick?: () => void;
}

export default function PrimaryButton({
  children,
  href,
  query,
  onClick,
}: Props) {
  const baseBtn =
    "inline-flex items-center justify-center px-3 py-2.5 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 lg:py-3.5 xl:px-6 xl:py-3.5 text-xs/4 sm:text-sm/tight lg:text-base/6 font-sourcecodepro font-medium gap-2 lg:gap-3 transition-all duration-500 ease-in-out cursor-pointer uppercase";

  if (href) {
    return (
      <Link
        href={{ pathname: href, query: query ?? {} }}
        className={`${baseBtn} bg-brand-1-900 text-brand-white rounded-md shadow-sm hover:bg-brand-1-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-brand-1-200 focus-visible:outline-0 focus-visible:outline-offset-0 focus-visible:outline-transparent`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseBtn} bg-brand-1-900 text-brand-white rounded-md shadow-sm hover:bg-brand-1-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-brand-1-200 focus-visible:outline-0 focus-visible:outline-offset-0 focus-visible:outline-transparent`}
    >
      {children}
    </button>
  );
}
