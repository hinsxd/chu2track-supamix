import { NavLink } from "@remix-run/react";

import { MenuIcon } from "lucide-react";

import { Page } from "~/components/page";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-50 h-16 w-full border-b border-b-muted-foreground bg-background">
        <div className="mx-auto flex h-16 w-full max-w-screen-lg items-center justify-between px-8">
          <div>
            <NavLink to="/">Chu2track</NavLink>
          </div>
          <div className="sm:hidden">
            <Button variant="ghost">
              <MenuIcon className="size-8" />
            </Button>
          </div>
          <div className="flex items-center gap-4 max-sm:hidden">
            <NavLink
              to="/songs"
              className={(state) =>
                cn(
                  state.isActive && "underline",
                  "underline-offset-4 hover:underline"
                )
              }
            >
              Songs
            </NavLink>
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
          </div>
        </div>
      </div>
      <Page className="w-full">{children}</Page>
    </div>
  );
};
