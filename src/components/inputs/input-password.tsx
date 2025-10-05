import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

const InputPassword = ({ ...props }: React.ComponentProps<"input">) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="w-full">
      <div className="relative">
        <Input
          type={isVisible ? "text" : "password"}
          {...props}
          className={cn(props.className, "pe-9")}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible((prevState) => !prevState)}
          className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 end-0 rounded-s-none"
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
    </div>
  );
};

export default InputPassword;
