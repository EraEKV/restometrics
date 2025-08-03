import { Generated, Insertable, Selectable, Updateable } from 'kysely';

export enum RestaurantStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export interface Database {
  restaurants: RestaurantsTable;
}

export interface RestaurantsTable {
  id: Generated<string>;
  name: string;
  address: string;
  coordinates: string; // PostgreSQL POINT как строка "POINT(lng lat)"
  has_menu: boolean;
  registration_id: string;
  custom_name: string | null;
  owner: string; // JSONB как строка
  status: RestaurantStatus;
  map_id: string | null;
  represent: string | null;
  create_date: Generated<Date>;
  update_date: Generated<Date>;
}

export type Restaurant = Selectable<RestaurantsTable>;
export type NewRestaurant = Insertable<RestaurantsTable>;
export type RestaurantUpdate = Updateable<RestaurantsTable>;

export interface RestaurantOwner {
  name: string;
  phone: string;
  email: string;
}
