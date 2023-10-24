import Image from "next/image";
import Link from "next/link";

interface MetricProp {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  textStyle?: string;
  href?: string;
  isAuthor?: boolean;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  textStyle,
  href,
  isAuthor,
}: MetricProp) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`object-contain ${
          href ? "cursor-pointer rounded-full" : ""
        }`}
      />
      <p className={`${textStyle} flex items-center gap-1`}>
        {value}

        <span
          className={`small-regular line-clamp-1 ${
            isAuthor ? "max-sm:hidden" : ""
          }`}
        >
          {title}
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center flex-wrap gap-1">
        {metricContent}
      </Link>
    );
  }

  return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
};

export default Metric;
