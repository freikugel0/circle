import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type TabsOutlinedProps = {
  value: string;
  onValueChange: (val: string) => void;
  tabs: {
    label: string;
    value: string;
    content: React.ReactNode;
  }[];
} & React.ComponentProps<typeof Tabs>;

const TabsOutlined = ({
  value,
  onValueChange,
  tabs,
  ...props
}: TabsOutlinedProps) => {
  return (
    <Tabs
      {...props}
      defaultValue="explore"
      value={value}
      onValueChange={(val) => onValueChange(val)}
      className={cn("gap-4 w-full", props.className)}
    >
      <TabsList className="bg-background gap-1 border p-1 w-full">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground dark:data-[state=active]:border-transparent"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabsOutlined;
