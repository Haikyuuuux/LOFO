export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // password only used when registering/logging in
}
