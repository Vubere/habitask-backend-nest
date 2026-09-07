
export type CreateUserType = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  profession: string;
  bio: string;
};

export type FindUserType = {
  search: string;
  active?: boolean;
  admin?: boolean;
  page?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  profession?: string;
}
export type UpdateUserType = {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  profession?: string;
  bio?: string;
}
