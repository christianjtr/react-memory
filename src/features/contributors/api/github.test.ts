import { beforeEach, describe, expect, it, vi } from 'vitest';
import { githubContributorsFixture } from '@/test/fixtures/contributors';
import {
  DEFAULT_REPOSITORY,
  fetchRepositoryContributors,
  GITHUB_API_URL,
  GithubApiError,
} from './github';

const fetchMock = vi.fn();

function createResponse(payload: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(payload),
  } as unknown as Response;
}

describe('fetchRepositoryContributors', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('fetches contributors from the default repository', async () => {
    fetchMock.mockResolvedValue(createResponse(githubContributorsFixture));

    await expect(fetchRepositoryContributors()).resolves.toEqual(
      githubContributorsFixture,
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `${GITHUB_API_URL}/facebook/react/contributors`,
      expect.objectContaining({
        headers: { Accept: 'application/vnd.github+json' },
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('encodes and fetches a custom repository', async () => {
    fetchMock.mockResolvedValue(createResponse(githubContributorsFixture));

    await fetchRepositoryContributors({ owner: 'vercel', name: 'next.js' });

    expect(fetchMock).toHaveBeenCalledWith(
      `${GITHUB_API_URL}/vercel/next.js/contributors`,
      expect.any(Object),
    );
  });

  it('rejects invalid repository segments without calling fetch', async () => {
    await expect(
      fetchRepositoryContributors({ owner: 'bad/owner', name: 'repo' }),
    ).rejects.toThrow('El repositorio contiene caracteres inválidos.');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports rate limiting errors', async () => {
    fetchMock.mockResolvedValue(createResponse([], 403));

    await expect(fetchRepositoryContributors()).rejects.toThrow(
      'GitHub limitó la cantidad de solicitudes. Intentá nuevamente en unos minutos.',
    );
  });

  it('reports unexpected status codes', async () => {
    fetchMock.mockResolvedValue(createResponse([], 500));

    await expect(fetchRepositoryContributors()).rejects.toThrow(
      'GitHub respondió con el estado 500.',
    );
  });

  it('rejects unexpected payloads', async () => {
    fetchMock.mockResolvedValue(createResponse({ message: 'not an array' }));

    await expect(fetchRepositoryContributors()).rejects.toThrow(
      'GitHub devolvió una respuesta inesperada.',
    );
  });

  it('filters invalid contributor entries', async () => {
    fetchMock.mockResolvedValue(
      createResponse([...githubContributorsFixture, { id: 'invalid' }]),
    );

    await expect(fetchRepositoryContributors()).resolves.toEqual(
      githubContributorsFixture,
    );
  });

  it('wraps network failures', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));

    await expect(fetchRepositoryContributors()).rejects.toMatchObject({
      name: 'GithubApiError',
      message: 'No se pudieron cargar los contribuyentes.',
    });
  });

  it('propagates an external abort as AbortError', async () => {
    const controller = new AbortController();
    controller.abort();

    fetchMock.mockImplementation((_input: RequestInfo | URL, init?: RequestInit) => {
      return init?.signal?.aborted
        ? Promise.reject(new DOMException('Aborted', 'AbortError'))
        : Promise.resolve(createResponse([]));
    });

    await expect(
      fetchRepositoryContributors(DEFAULT_REPOSITORY, controller.signal),
    ).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('fails when GitHub does not respond in time', async () => {
    vi.useFakeTimers();

    try {
      fetchMock.mockImplementation((_input: RequestInfo | URL, init?: RequestInit) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        });
      });

      const request = fetchRepositoryContributors();
      const assertion = expect(request).rejects.toThrow(
        'GitHub tardó demasiado en responder.',
      );

      await vi.advanceTimersByTimeAsync(10_000);
      await assertion;
    } finally {
      vi.useRealTimers();
    }
  });

  it('exposes errors with an optional status', () => {
    const error = new GithubApiError('failure', 418);

    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(418);
  });
});
