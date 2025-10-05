import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InputStartIconProps = {
  icon: React.ReactNode;
} & React.ComponentProps<"input">;

const InputStartIcon = ({ icon, ...props }: InputStartIconProps) => {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
          {icon}
        </div>
        <Input {...props} className={cn(props.className, "pl-9")} />
      </div>
    </div>
  );
};

export default InputStartIcon;
