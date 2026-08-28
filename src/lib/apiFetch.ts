export async function apiFetch(
  url: string,
  options?: RequestInit
) {
  const response = await fetch(url, options);

  if (
    response.status !== 401 ||
    url.includes("/auth/refresh")
  ) {
    return response;
  }

  const refreshResponse = await fetch(
    "/api/v1/auth/refresh",
    {
      method: "POST",
    }
  );

  if (!refreshResponse.ok) {
    throw new Error("Session expired");
  }

  return fetch(url, options);
}