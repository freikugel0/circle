import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Brand } from "./brand";
import {
  BadgePlus,
  BellIcon,
  CheckIcon,
  HeartIcon,
  HomeIcon,
  LogOutIcon,
  SearchIcon,
  Settings2Icon,
  Trash2Icon,
  UserCircleIcon,
} from "lucide-react";
import { Badge, Button } from "./ui";
import { cn, timeAgo } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import useAuthStore from "@/stores/auth.store";
import { UserAvatar } from "./user-avatar";
import useNotificationStore from "@/stores/notification.store";
import { ScrollableDialog } from "./dialogs/scrollable-dialog";

const items = [
  {
    to: "/",
    icon: HomeIcon,
    label: "Home",
  },
  {
    to: "/search",
    icon: SearchIcon,
    label: "Search",
  },
  {
    to: "/follows",
    icon: HeartIcon,
    label: "Follows",
  },
  {
    to: "/profile",
    icon: UserCircleIcon,
    label: "Profile",
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const pathname = useRouterState().location.pathname;

  const user = useAuthStore((s) => s.user);

  const [popoverOpen, setPopoverOpen] = useState(false);

  // const [logoutDialog, setLogoutDialog] = useState(false);
  const { logout } = useAuthStore();

  const [notificationDialog, setNotificationDialog] = useState(false);
  const {
    notifications,
    readNotifications,
    readNotification,
    deleteNotifications,
    deleteNotification,
  } = useNotificationStore();
  const unreadNotificationsCounter = notifications.reduce(
    (acc, n) => acc + (n?.read ? 0 : 1),
    0,
  );

  return (
    <>
      <div className="flex flex-col justify-between min-h-screen items-start px-6 py-6 w-full border-r">
        <div className="flex flex-col gap-10 w-full">
          <Brand className="text-6xl" />
          <div className="flex flex-col gap-8">
            {items.map((i) => {
              const isActive = i.to === pathname;
              return (
                <Link
                  key={i.label}
                  to={i.to}
                  className="flex items-center gap-4"
                >
                  {isActive ? (
                    <i.icon className="w-8 h-8 text-primary" />
                  ) : (
                    <i.icon className="w-8 h-8" />
                  )}
                  <span className={cn("text-xl", isActive && "text-primary")}>
                    {i.label}
                  </span>
                </Link>
              );
            })}
          </div>
          <Button className="w-full text-lg hover:cursor-pointer">
            <BadgePlus />
            Create
          </Button>
        </div>
        <div className="w-full flex justify-center items-center">
          {user && (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <div className="w-full flex items-center gap-2 rounded-full hover:bg-accent hover:cursor-pointer transition-all px-4 py-2">
                  <div className="relative inline-block">
                    <UserAvatar
                      src={user.photo_profile}
                      alt={`@${user.username}`}
                      colors={["#e7e5e4", "#1e293b", "#f3e5f5"]}
                    />
                    {unreadNotificationsCounter > 0 && (
                      <Badge className="absolute -top-2 -left-2 px-1 py-0.1">
                        {unreadNotificationsCounter}
                      </Badge>
                    )}
                  </div>
                  <p className="font-semibold text-secondary-foreground">
                    @{user.username}
                  </p>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="grid gap-4">
                  {[
                    {
                      icon: BellIcon,
                      label: "Notifications",
                      action: () => {
                        setNotificationDialog(true);
                      },
                    },
                    {
                      icon: Settings2Icon,
                      label: "Settings",
                      action: () => {},
                    },
                    {
                      icon: LogOutIcon,
                      label: "Log Out",
                      action: () => {
                        navigate({ to: "/login" });
                        logout();
                      },
                    },
                  ].map((i) => (
                    <button
                      type="button"
                      key={i.label}
                      onClick={() => {
                        i.action();
                        setPopoverOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-4 px-4 py-2 rounded-full hover:bg-accent hover:cursor-pointer transition-all">
                        <i.icon />
                        <span>{i.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      {/* Notification */}
      <ScrollableDialog
        title="Your Notifications"
        description={`You have ${notifications.length} notification(s)`}
        open={notificationDialog}
        onOpenChange={setNotificationDialog}
        footerComponent={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                deleteNotifications();
              }}
              variant={"destructive"}
            >
              Delete all
            </Button>
            <Button
              onClick={() => {
                readNotifications();
              }}
            >
              Mark all as read
            </Button>
          </div>
        }
      >
        <div className="p-0.5 flex flex-col gap-4">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className="flex gap-2 justify-between items-center px-2 py-1 bg-card dark:bg-card/30 rounded-md"
              >
                <UserAvatar
                  src={n.from.photo_profile}
                  alt={`@${n.from.username}`}
                  colors={["#e7e5e4", "#1e293b", "#f3e5f5"]}
                />
                <p className="text-sm text-muted-foreground">
                  {n.type === "MENTION" && (
                    <>
                      <span className="font-semibold text-primary">
                        @{n.from.username}
                      </span>{" "}
                      <span className="text-foreground">mentioned you in</span>{" "}
                      <span className="italic text-accent-foreground">
                        "{n.thread.title}"
                      </span>
                    </>
                  )}
                </p>{" "}
                <div className="flex flex-col items-end gap-2">
                  <p className="text-sm">{timeAgo(n.created_at)}</p>
                  <div className="flex items-center">
                    <Button
                      onClick={() => {
                        deleteNotification(n.id);
                      }}
                      variant={"ghost"}
                      size={"icon"}
                      className="hover:text-destructive"
                    >
                      <Trash2Icon />
                    </Button>
                    <Button
                      onClick={() => {
                        readNotification(n.id);
                      }}
                      variant={n.read ? "ghost" : "default"}
                      size={"icon"}
                      disabled={n.read}
                    >
                      <CheckIcon />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h1>You're all caught up</h1>
          )}
        </div>
      </ScrollableDialog>
    </>
  );
};
