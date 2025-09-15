import React from "react";
import clsx from "clsx";

type TypographyProps = {
  children: React.ReactNode;
  className?: string;
};

export const PageSubTitle: React.FC<TypographyProps> = ({
  children,
  className,
}) => {
  return (
    <h3
      className={clsx(
        "mb-2 text-sm/8 md:text-base/6 font-medium font-sourcecodepro text-slate-900 uppercase",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const PageTitle: React.FC<TypographyProps> = ({
  children,
  className,
}) => {
  return (
    <h2
      className={clsx(
        "mb-2 text-3xl md:text-4xl xl:text-5xl leading-snug font-bold font-montserrat text-slate-900 tracking-tight text-balance page-title",
        className
      )}
    >
      {children}
    </h2>
  );
};

export const PageTitleText: React.FC<TypographyProps> = ({
  children,
  className,
}) => {
  return (
    <p
      className={clsx(
        "text-base/6 md:text-lg/7 font-normal font-baskervville text-slate-800 max-w-md mx-auto",
        className
      )}
    >
      {children}
    </p>
  );
};

export const InnerPageTitle: React.FC<TypographyProps> = ({
  children,
  className,
}) => {
  return (
    <h2
      className={clsx(
        "text-2xl md:text-3xl leading-snug xl:text-4xl text-slate-900 font-montserrat font-bold",
        className
      )}
    >
      {children}
    </h2>
  );
};
