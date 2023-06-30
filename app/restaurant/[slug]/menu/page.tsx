import { Metadata } from 'next';

import RestaurantNavBar from '../components/RestaurantNavBar';
import Menu from '../components/Menu';

export const metadata: Metadata = {
  title: 'Some dynamic temp title for menu',
};

export default function RestaurantMenu() {
  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <RestaurantNavBar />
      <Menu />
    </div>
  );
}
