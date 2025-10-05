import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui";

type StickyDialogProps = {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (val: boolean) => void;
  footerComponent: React.ReactNode;
  children: React.ReactNode;
};

export const ScrollableDialog = ({
  title,
  description,
  open,
  onOpenChange,
  footerComponent,
  children,
}: StickyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {children}
        </ScrollArea>
        <DialogFooter>{footerComponent}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
