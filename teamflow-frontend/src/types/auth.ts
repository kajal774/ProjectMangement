// These types mirror the JSON shape the Spring Boot backend returns.
// Keeping them simple and flat (no complex generics) so it's obvious
// what a login/register response looks like on the wire.

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
