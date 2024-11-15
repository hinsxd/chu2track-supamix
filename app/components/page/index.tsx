import { cn } from "~/lib/utils";

export const Page = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-screen-lg flex-col px-8 py-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
