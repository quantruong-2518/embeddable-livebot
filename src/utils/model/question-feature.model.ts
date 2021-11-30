export interface IContainerCard {
  image: string;
  carousels: Array<ICarousel>;
}

export interface ICarousel {
  cards: Array<ICard>;
  content: string;
}

export interface ICard {
  image: string;
  type: number;
  topics: {
    content: string;
    questions: Array<any>;
  }[];
}

export interface IQuestion {
  title: string;
  _id: string;
  answers?: Array<any>;
}
