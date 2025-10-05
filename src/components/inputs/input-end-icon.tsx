import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";

type InputEndIconProps = {
  icon: React.ReactNode;
} & React.ComponentProps<"input">;

const InputEndIcon = ({ icon, ...props }: InputEndIconProps) => {
  return (
    <div className="w-full">
      <div className="relative">
        <Input {...props} className={cn(props.className, "pe-9")} />
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center ps-px pe-3 peer-disabled:opacity-50">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default InputEndIcon;
