import { compareAsc, parseISO } from 'date-fns';

export type Order = {
  _id: string;
  props: {
    recipient_id: string;
    traking_code: string;
    date: string;
    name?: string;
    isDelivered: boolean;
  };
  trakings: {
    recipient_traking_created_at: string;
    message: string;
  }[];
};
type OrdermModel = {
  id: string;
  name?: string;
  traking_code: string;
  status: string;
  date: string;
  isDelivered: boolean;
};

export const parseOrder = ({ props, _id, trakings }: Order): OrdermModel => {
  const [traking] = trakings.sort((a, b) =>
    compareAsc(
      parseISO(a.recipient_traking_created_at),
      parseISO(b.recipient_traking_created_at),
    ),
  );

  return {
    id: _id,
    date: props.date,
    isDelivered: props.isDelivered,
    name: props?.name || '',
    status: traking?.message || '',
    traking_code: props.traking_code,
  };
};
