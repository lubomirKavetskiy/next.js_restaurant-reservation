interface IProps {
  description: string;
}

export default function RestaurantDescription({ description }: IProps) {
  return (
    <div className="mt-4">
      <p className="text-lg font-light">{description}</p>
    </div>
  );
}
