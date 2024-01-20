import Image from "next/image";
import Link from "next/link";

interface ProfileLinkProps {
  imgUrl: string;
  title: string;
  href?: string;
}

const ProfileLink = ({ imgUrl, href, title }: ProfileLinkProps) => {
  return (
    <div className='flex-center gap-1'>
      <Image
        src={imgUrl}
        width={18}
        height={18}
        alt='icon'
      />
      {href ? (
        <Link
          href={href}
          target='_blank'
          className='paragraph-medium text-blue-500'
        >
          {title}
        </Link>
      ) : (
        <p className='paragraph-medium text-dark400_light700'>{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
