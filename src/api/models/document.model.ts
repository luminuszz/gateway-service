export type DocumentModel = {
  props: {
    status: string;
    url: string;
    createdAt: Date;
    cap: number;
    category: string;
    name: string;
    recipientId: string;
    hasNewchapter: boolean;
    id: string;
  };
};

type ClientDocumentModel = {
  status: string;
  url: string;
  createdAt: Date;
  cap: number;
  category: string;
  name: string;
  recipientId: string;
  hasNewchapter: boolean;
  id: string;
};

export const parseDocument = (document: DocumentModel): ClientDocumentModel =>
  document.props;
