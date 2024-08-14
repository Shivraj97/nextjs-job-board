import React from "react";

type BadgeProps = {
  children: React.ReactNode;
};

const Badge = ({ children }: BadgeProps) => {
  return (
    <span className="rounded-full border bg-primary/10 text-primary px-2 py-1 text-xs">{children}</span>
  );
};

export default Badge;
