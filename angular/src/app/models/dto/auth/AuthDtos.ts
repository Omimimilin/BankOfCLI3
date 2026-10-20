export type LoginRequestDto = {
  username: string;
  plainTextPin: string;
};

export type LoginResponseDto = {
  accountId: string;
  username: string;
  accessToken: string;
};

export type RegisterRequestDto = {
  username: string;
  name: string;
  plainTextPin: string;
};

export type RegisterResponseDto = {
  accountId: number;
  username: string;
  name: string;
};
