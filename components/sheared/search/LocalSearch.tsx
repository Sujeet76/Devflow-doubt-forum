import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Props {
  icon: string;
  placeholder: string;
  iconPosition: string;
  otherClasses?: string;
}

const LocalSearch = ({
  icon,
  placeholder,
  iconPosition,
  otherClasses,
}: Props) => {
  return (
    <div
      className={`background-light800_darkgradient relative flex min-h-[56px] w-full grow items-center gap-1 rounded-xl px-4 ${
        iconPosition === "right" && "flex-row-reverse"
      } ${otherClasses}`}
    >
      <Image
        src={icon}
        width={24}
        height={24}
        alt="search icon"
        className="cursor-pointer"
      />
      <Input
        type="text"
        className="paragraph-regular background-light800_darkgradient no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
        placeholder={placeholder}
      />
    </div>
  );
};

export default LocalSearch;
