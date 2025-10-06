export interface PetDtoCreate {
  name: string;
  age: string;
  status: string;
  location: string;
  latitude?: number;
  longitude?: number;
  description: string;
  species: string;
  type: string;
  userId: string;
  petImage: PetImageDtoCreate[];
}
export interface PetDtoUpdate {
  name?: string;
  age?: number;
  type?: string;
  userId?: string;
}
export interface PetImageDtoCreate {
  imageUrl: string;
  petId: string;
}
