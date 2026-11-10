export async function checkoutUser<T extends { id: string; is_anonymous?: boolean }>(
  authorization: string | null,
  getUser: (token: string) => Promise<{ data: { user: T | null }; error: unknown }>,
): Promise<T | null> {
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);
  if (!match) return null;
  const { data, error } = await getUser(match[1]);
  return error || !data.user || data.user.is_anonymous ? null : data.user;
}