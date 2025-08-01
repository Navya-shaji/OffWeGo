export interface CreateGroupDTO {
  packageId: string;
  startDate: Date;
  endDate: Date;
  minPeople: number;
  maxPeople: number;
}