import { cn } from "~/lib/utils";

export const Page = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div className={cn("flex flex-col px-8 py-6", className)} {...props}>
      {children}
    </div>
  );
};
