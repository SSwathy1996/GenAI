import { Label } from '../../../domain/models/Label';
import { LabelRepository } from '../../../domain/repositories/LabelRepository';

/**
 * In-memory implementation of LabelRepository (for dev/testing).
 */
export class InMemoryLabelRepository implements LabelRepository {
  private labels = new Map<string, Label>();

  async getById(id: string): Promise<Label | undefined> {
    return this.labels.get(id);
  }

  async getAll(): Promise<Label[]> {
    return Array.from(this.labels.values());
  }

  async create(label: Label): Promise<Label> {
    this.labels.set(label.id, label);
    return label;
  }

  async delete(id: string): Promise<void> {
    this.labels.delete(id);
  }
}

export default InMemoryLabelRepository;