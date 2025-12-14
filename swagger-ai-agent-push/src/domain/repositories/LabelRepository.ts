import { Label } from '../models/Label';

/**
 * Interface for Label repository (CRUD for labels).
 */
export interface LabelRepository {
  getById(id: string): Promise<Label | undefined>;
  getAll(): Promise<Label[]>;
  create(label: Label): Promise<Label>;
  delete(id: string): Promise<void>;
}
