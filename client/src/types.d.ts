type PostDTO = {
  id: number;
  createdAt: string;
  emoji: string;
};

type Post = Omit<PostDTO, 'createdAt'> & {
  createdAt: Date;
};
