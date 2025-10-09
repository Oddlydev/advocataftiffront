import React from "react";
import { useRouter } from "next/router";

interface WhiteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  url?: string; // optional route
  className?: string;
}

export default function WhiteButton({ children, url, className = "", ...rest }: WhiteButtonProps) {
  const router = useRouter();

  const baseBtn =
    "inline-flex items-center justify-center px-3 py-2.5 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 lg:py-3.5 xl:px-6 xl:py-3.5 text-xs/4 sm:text-sm/tight lg:text-base/6 font-sourcecodepro font-medium gap-2 lg:gap-3 transition-all duration-500 ease-in-out cursor-pointer uppercase rounded-md";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (url) {
      e.preventDefault();
      router.push(url);
    }
    // else allow default onClick if passed in rest
    if (rest.onClick) rest.onClick(e);
  };

  return (
    <button
      {...rest} // allows passing extra props like type, disabled
      onClick={handleClick}
      className={`${baseBtn} bg-white border border-slate-200 text-gray-600 shadow-sm hover:bg-slate-100 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 focus-visible:outline-0 focus-visible:outline-offset-0 focus-visible:outline-transparent ${className}`}
    >
      {children}
    </button>
  );
}
