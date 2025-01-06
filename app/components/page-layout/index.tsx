import { NavLink } from "@remix-run/react";

import { Page } from "~/components/page";
import { cn } from "~/lib/utils";

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-50 h-16 w-full border-b border-b-muted-foreground bg-background">
        <div className="mx-auto flex h-16 w-full max-w-screen-lg items-center justify-between px-8">
          <div>
            <NavLink to="/">Chu2track</NavLink>
          </div>
          {/* TODO: add mobile menu */}
          {/* <div className="sm:hidden">
            <Button variant="ghost">
              <MenuIcon className="size-8" />
            </Button>
          </div> */}
          <div className="flex items-center gap-4">
            <NavLink
              to="/sheets"
              className={(state) =>
                cn(
                  state.isActive && "underline",
                  "underline-offset-4 hover:underline"
                )
              }
            >
              Sheets
            </NavLink>
            <NavLink
              to="/highscores"
              className={(state) =>
                cn(
                  state.isActive && "underline",
                  "underline-offset-4 hover:underline"
                )
              }
            >
              Highscores
            </NavLink>
          </div>
        </div>
      </div>
      <Page className="w-full">{children}</Page>
    </div>
  );
};
