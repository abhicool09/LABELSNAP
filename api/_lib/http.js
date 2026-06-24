export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, 'Request body must be valid JSON.');
  }
}

export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function handleError(error) {
  if (error instanceof HttpError) {
    return json({ error: error.message, details: error.details }, error.status);
  }
  console.error(error);
  return json({ error: 'Unexpected server error.' }, 500);
}

export function requireMethod(request, method) {
  if (request.method !== method) {
    throw new HttpError(405, `Use ${method} for this endpoint.`);
  }
}

