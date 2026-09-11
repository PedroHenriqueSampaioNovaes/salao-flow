export async function checkSubscriptionActive(token: string) {
  try {
    const response = await fetch(`${process.env.API_URL}/barbershops/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return true;

    const barbershop = await response.json();

    return barbershop.status !== false;
  } catch {
    return true;
  }
}
