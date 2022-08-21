export type TErrorRegister = {
  [key: string]: string[] | undefined;
  email?: string[];
  role?: string[];
  name?: string[];
  lastname?: string[];
  password?: string[];
  phone?: string[];
  country?: string[];
  birthday?: string[];
};

export type TErrorObject = {
  [key: string]:
    | string
    | number
    | string[]
    | { [key: string]: string }[]
    | undefined
    | {};
};
