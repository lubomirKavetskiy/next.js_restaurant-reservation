import { Item } from '@prisma/client';

import MenuCard from './MenuCard';

interface IProps {
  menu: Item[];
}

export default function Menu({ menu }: IProps) {
  return (
    <main className="bg-white mt-5">
      <div>
        <div className="mt-4 pb-1 mb-1">
          <h1 className="font-bold text-4xl">Menu</h1>
        </div>
        {menu?.length ? (
          <div className="flex flex-wrap justify-between">
            {menu.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-[10vh]">
            <p className="text-1xl">This restaurant does not have a menu</p>
          </div>
        )}
      </div>
    </main>
  );
}
