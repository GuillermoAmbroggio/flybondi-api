export interface IPassenger {
  name: string;
  lastname: string;
  age: number;
}

export interface OrdersAttributes {
  id?: number;
  user_id?: number;
  passengers: IPassenger[] | string;
  origin: string;
  destination: string;
  goBack: boolean;
  data_go: string;
  data_back?: string;
  total: number;
}

export type TOrdersData = {
  id: number;
  passengers: IPassenger[];
  origin: string;
  destination: string;
  goBack: boolean;
  data_go: string;
  data_back: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
};
