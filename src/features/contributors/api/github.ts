import type { GithubContributor, Repository } from '../types';

export const GITHUB_API_URL = 'https://api.github.com/repos';
export const DEFAULT_REPOSITORY: Repository = {
  owner: import.meta.env.VITE_REPO_OWNER?.trim() || 'facebook',
  name: import.meta.env.VITE_REPO_NAME?.trim() || 'react',
};

const REPOSITORY_SEGMENT_PATTERN = /^[A-Za-z0-9._-]+$/;
const REQUEST_TIMEOUT_MS = 10_000;

export class GithubApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number, options?: ErrorOptions) {
    super(message, options);
    this.name = 'GithubApiError';
    this.status = status;
  }
}

export function isGithubContributor(value: unknown): value is GithubContributor {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'number' &&
    typeof candidate.login === 'string' &&
    typeof candidate.avatar_url === 'string'
  );
}

function assertValidRepositorySegment(value: string): void {
  if (!REPOSITORY_SEGMENT_PATTERN.test(value)) {
    throw new GithubApiError('El repositorio contiene caracteres inválidos.');
  }
}

export async function fetchRepositoryContributors(
  repository: Repository = DEFAULT_REPOSITORY,
  signal?: AbortSignal,
): Promise<GithubContributor[]> {
  assertValidRepositorySegment(repository.owner);
  assertValidRepositorySegment(repository.name);

  const controller = new AbortController();
  const abortRequest = (): void => {
    controller.abort(signal?.reason);
  };

  if (signal?.aborted) {
    abortRequest();
  } else {
    signal?.addEventListener('abort', abortRequest, { once: true });
  }

  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  const url = `${GITHUB_API_URL}/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}/contributors`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        throw new GithubApiError(
          'GitHub limitó la cantidad de solicitudes. Intentá nuevamente en unos minutos.',
          response.status,
        );
      }

      throw new GithubApiError(
        `GitHub respondió con el estado ${response.status}.`,
        response.status,
      );
    }

    const payload: unknown = await response.json();

    if (!Array.isArray(payload)) {
      throw new GithubApiError('GitHub devolvió una respuesta inesperada.');
    }

    return payload.filter(isGithubContributor);
  } catch (error) {
    if (error instanceof GithubApiError) throw error;

    if (controller.signal.aborted) {
      if (signal?.aborted) {
        throw new DOMException('La solicitud fue cancelada.', 'AbortError');
      }

      throw new GithubApiError('GitHub tardó demasiado en responder.');
    }

    throw new GithubApiError('No se pudieron cargar los contribuyentes.', undefined, {
      cause: error,
    });
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abortRequest);
  }
}
