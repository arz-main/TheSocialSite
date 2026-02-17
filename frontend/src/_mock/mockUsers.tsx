export type Role = "artist" | "admin";

export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  avatar?: string;
}

export const mockUsers: MockUser[] = [
  {
    id: "1",
    email: "artist@test.com",
    password: "artist123",
    name: "Dan",
    role: "artist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    id: "2",
    email: "admin@test.com",
    password: "admin123",
    name: "Denis",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  }
];

export function findUser(email: string, password: string): MockUser | null {
  return mockUsers.find(
    (u) => u.email === email && u.password === password
  ) ?? null;
}