export interface UserDtoCreate {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface UserDtoUpdate {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
}
