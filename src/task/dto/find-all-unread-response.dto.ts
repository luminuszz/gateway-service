export type Category = 'manga' | 'anime' | 'Webtoom';

export type Status = 'read' | 'unread';

export class FindAllUnreadResponseDto {
  props: {
    id?: string;
    name: string;
    cap: number;
    nextCap?: number | null | undefined;
    url: string;
    createatAt: Date;

    category: Category;
    recipientId: string;
    status: Status;
  };
}
