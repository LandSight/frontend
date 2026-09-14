export type User = {
  id: string;
  username: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterCredentials = {
  username: string;
  password: string;
};

export type AuthTokens = {
  access_token: string;
  token_type: string;
};
