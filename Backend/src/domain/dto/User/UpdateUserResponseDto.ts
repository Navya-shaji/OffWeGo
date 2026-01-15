export interface UpdateUserResponseDto {
  id: string;
  email: string;
  status: "active" | "blocked";
}
