import Header from './components/Header';
import Form from './components/Form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Some dynamic temp title for rreserve',
};

export default function Reservation() {
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header />
        <Form />
      </div>
    </div>
  );
}
