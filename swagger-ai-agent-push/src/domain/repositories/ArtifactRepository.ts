import { Artifact } from '../models/Artifact';

/**
 * Interface for Artifact repository (CRUD for artifacts).
 */
export interface ArtifactRepository {
  getById(id: string): Promise<Artifact | undefined>;
  getAllByRun(runId: string): Promise<Artifact[]>;
  create(artifact: Artifact): Promise<Artifact>;
  delete(id: string): Promise<void>;
}
