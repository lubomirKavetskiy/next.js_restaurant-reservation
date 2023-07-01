interface IProps {
  images: string[];
}

export default function RestaurantImages({ images }: IProps) {
  const imgLength = images?.length;
  return (
    <div>
      <h1 className="font-bold text-3xl mt-10 mb-7 border-b pb-5">
        {imgLength} photo{imgLength > 1 ? 's' : ''}
      </h1>
      <div className="flex flex-wrap">
        {images?.map((image, idx) => (
          <img key={idx} className="w-56 h-44 mr-1 mb-1" src={image} alt="" />
        ))}
      </div>
    </div>
  );
}
