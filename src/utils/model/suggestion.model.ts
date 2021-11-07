export interface SuggestionAnswer {
  _id: string;
  content: string;
  type: string;
}

export interface Suggestion {
  answers: Array<SuggestionAnswer>;
  createdAt: string;
  status: number;
  title: string;
  updatedAt: string;
  _id: string;
  type: string;
}
