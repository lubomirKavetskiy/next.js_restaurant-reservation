import { PRICE } from '@prisma/client';
import React from 'react';

interface IProps {
  price: PRICE;
}

export default function Price({ price }: IProps) {
  const renderPrice = () => {
    switch (price) {
      case PRICE.CHEAP:
        return (
          <>
            <span>$$</span>
            <span className="text-gray-400">$$</span>
          </>
        );
      case PRICE.REGULAR:
        return (
          <>
            <span>$$$</span>
            <span className="text-gray-400">$</span>
          </>
        );
      case PRICE.EXPENSIVE:
        return (
          <>
            <span>$$$$</span>
          </>
        );
      default:
        return '';
    }
  };

  return <p className="flex mr-3">{renderPrice()}</p>;
}
