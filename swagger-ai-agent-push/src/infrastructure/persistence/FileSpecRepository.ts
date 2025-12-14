import { Feature } from '../../../domain/models/Feature';
import { FeatureRepository } from '../../../domain/repositories/FeatureRepository';
import * as fs from 'fs';
import * as path from 'path';

/**
 * File-backed implementation of FeatureRepository for specs.
 * Stores each feature as a JSON file in a directory.
 */
export class FileSpecRepository implements FeatureRepository {
  private dir: string;

  constructor(dir = path.join(process.cwd(), 'data', 'features')) {
    this.dir = dir;
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir, { recursive: true });
    }
  }

  async getById(id: string): Promise<Feature | undefined> {
    const file = path.join(this.dir, `${id}.json`);
    if (!fs.existsSync(file)) return undefined;
    const data = await fs.promises.readFile(file, 'utf-8');
    return JSON.parse(data) as Feature;
  }

  async getAll(): Promise<Feature[]> {
    const files = await fs.promises.readdir(this.dir);
    const features: Feature[] = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const data = await fs.promises.readFile(path.join(this.dir, file), 'utf-8');
        features.push(JSON.parse(data));
      }
    }
    return features;
  }

  async create(feature: Feature): Promise<Feature> {
    const file = path.join(this.dir, `${feature.id}.json`);
    await fs.promises.writeFile(file, JSON.stringify(feature, null, 2), 'utf-8');
    return feature;
  }

  async update(feature: Feature): Promise<Feature> {
    return this.create(feature);
  }

  async delete(id: string): Promise<void> {
    const file = path.join(this.dir, `${id}.json`);
    if (fs.existsSync(file)) {
      await fs.promises.unlink(file);
    }
  }
}

export default FileSpecRepository;