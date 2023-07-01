import Link from 'next/link';

interface IProps {
  slug: string;
}

export default function RestaurantNavBar({ slug }: IProps) {
  const href = `/restaurant/${slug}`;

  return (
    <nav className="flex text-reg border-b pb-2">
      <Link href={href} className="mr-7">
        Overview
      </Link>
      <Link href={`${href}/menu`} className="mr-7">
        Menu
      </Link>
    </nav>
  );
}
