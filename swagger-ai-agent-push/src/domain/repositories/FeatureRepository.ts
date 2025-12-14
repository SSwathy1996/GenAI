import { Feature } from '../models/Feature';

/**
 * Interface for Feature repository (CRUD for features).
 */
export interface FeatureRepository {
  getById(id: string): Promise<Feature | undefined>;
  getAll(): Promise<Feature[]>;
  create(feature: Feature): Promise<Feature>;
  update(feature: Feature): Promise<Feature>;
  delete(id: string): Promise<void>;
}
