import { cn } from "@/lib/utils";

export const Brand = ({ ...props }: React.ComponentProps<"h1">) => {
  return (
    <h1
      {...props}
      className={cn("text-4xl font-semibold select-none", props.className)}
    >
      circle
    </h1>
  );
};
