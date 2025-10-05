import BoringAvatars from "boring-avatars";
import { Avatar, AvatarImage } from "./ui";
import { baseImageUrl } from "@/lib/utils";

type UserAvatarProps = {
  src?: string | null;
  alt: string;
  size?: number;
} & Pick<React.ComponentProps<typeof BoringAvatars>, "colors">;

export const UserAvatar = (props: UserAvatarProps) => {
  return (
    <Avatar
      style={{
        width: props.size ?? 42,
        height: props.size ?? 42,
      }}
    >
      {props.src ? (
        <AvatarImage
          src={`${baseImageUrl}/${props.src}`}
          alt={`${props.alt}`}
        />
      ) : (
        <BoringAvatars
          name={`${props.alt}`}
          colors={props.colors}
          variant="beam"
        />
      )}
    </Avatar>
  );
};
