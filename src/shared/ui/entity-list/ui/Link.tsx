import _Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface LinkProps {
  href: {
    pathname: string;
    query?: Record<string, string | string[] | undefined>;
  };
  children: ReactNode;
}

function Link({ href, children }: LinkProps) {
  const router = useRouter();

  return (
    <_Link
      href={{
        pathname: href.pathname,
        query: {
          ...href.query,
          ...router.query,
        },
      }}
    >
      {children}
    </_Link>
  );
}

export default Link;
