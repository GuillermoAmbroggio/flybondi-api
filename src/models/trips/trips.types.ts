export interface TripsAttributes {
  origin: string;
  destination: string;
  price: number;
  availability: number;
  data: string;
  [key: string]: string | number;
}

export type TTripsData = {
  id: number;
  origin: string;
  destination: string;
  price: number;
  availability: number;
  data: string;
  createdAt: Date;
  updatedAt: Date;
};
