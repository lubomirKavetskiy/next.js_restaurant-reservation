import { Metadata } from 'next';

import Header from './components/Header';
import RestraunatCard from './components/RestraunatCard';
import SearchSideBar from './components/SearchSideBar';

export const metadata: Metadata = {
  title: 'Search',
};

export default function Search() {
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar />
        <div className="w-5/6">
          <RestraunatCard />
        </div>
      </div>
    </>
  );
}
