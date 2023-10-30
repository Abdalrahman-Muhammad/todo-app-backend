export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IColor {
  id: string;
  name: string;
  code: string;
}
export interface IIcon {
  id: string;
  name: string;
  symbol: string;
}
export interface ICategory {
  id: string;
  name: string;
  user: IUser | string;
  isEditable: boolean;
  color: IColor;
  icon: IIcon;
}

export interface ITask {
  id: string;
  name: string;
  categoryId: string;
  userId: string;
  isEditable: boolean;
  isCompleted: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}
