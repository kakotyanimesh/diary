
import Link from "next/link";
import { Heart } from "./icons/heart";

export const Footer = () => {
  return (
    <div className='justify-items-center mb-5
        fixed bottom-0'>
      <Link href={"https://www.kakoty.me/"} target="_blank" className="flex flex-row items-center gap-1  text-sm cursor-pointer">
        Made with{" "}
        <Heart/>
        Animesh kakoty
      </Link>
    </div>
  );
};
