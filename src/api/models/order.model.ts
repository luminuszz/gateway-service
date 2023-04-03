import { compareDesc, parseISO } from 'date-fns';

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
    _id: string;
    props: {
      recipient_traking_created_at: string;
      message: string;
      description?: string;
    };
  }[];
};
type OrdermModel = {
  id: string;
  name?: string;
  traking_code: string;
  status: string;
  date: string;
  isDelivered: boolean;
  lastDescription?: string;
};

export const parseOrder = ({ props, _id, trakings }: Order): OrdermModel => {
  const [traking] = trakings.sort((a, b) =>
    compareDesc(
      parseISO(a.props.recipient_traking_created_at),
      parseISO(b.props.recipient_traking_created_at),
    ),
  );

  return {
    id: _id,
    date: props.date,
    isDelivered: props.isDelivered,
    name: props?.name || '',
    status: traking?.props.message || '',
    traking_code: props.traking_code,
    lastDescription: traking?.props?.description || '',
  };
};
