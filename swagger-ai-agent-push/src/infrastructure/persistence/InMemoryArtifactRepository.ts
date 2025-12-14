import { Artifact } from '../../../domain/models/Artifact';
import { ArtifactRepository } from '../../../domain/repositories/ArtifactRepository';

/**
 * In-memory implementation of ArtifactRepository (for dev/testing).
 */
export class InMemoryArtifactRepository implements ArtifactRepository {
  private artifacts = new Map<string, Artifact>();

  async getById(id: string): Promise<Artifact | undefined> {
    return this.artifacts.get(id);
  }

  async getAllByRun(runId: string): Promise<Artifact[]> {
    return Array.from(this.artifacts.values()).filter(a => a.runId === runId);
  }

  async create(artifact: Artifact): Promise<Artifact> {
    this.artifacts.set(artifact.id, artifact);
    return artifact;
  }

  async delete(id: string): Promise<void> {
    this.artifacts.delete(id);
  }
}

export default InMemoryArtifactRepository;