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
  data: {
    content: string;
    data: Array<IQuestion>;
  }[];
}

export interface IQuestion {
  content: string;
  answer?: string
}
