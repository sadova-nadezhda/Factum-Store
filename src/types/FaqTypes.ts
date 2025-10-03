export type FaqItem = {
  id: number | string;
  question: string;
  answer: string;
};

export type FaqResponse = FaqItem[];