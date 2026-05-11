// API-route, der henter information om destillerier fra ekstern API og returnerer unikke resultater
export async function GET() {
  const res = await fetch("https://whiskyhunter.net/api/distilleries_info/");
  const data = await res.json();

  //Fjern dubletter i data ved at filtrere arrayet, så kun unikke destillerier (baseret på slug) bliver gemt i state.
  //Den looper gennem data-arrayet og sammenligner hvert element med det første element i arrayet, der har samme slug.
  // Hvis det er det samme element, bliver det inkluderet i det nye array (unique), ellers bliver det filtreret fra.
  // Item er det aktuelle element i loopet, index er dets position i arrayet, og self er hele arrayet.
  // index === self.findIndex((d) => d.slug === item.slug) betyder, at kun det første element med en given slug vil blive inkluderet
  const unique = data.filter(
    (item: any, index: number, self: any[]) =>
      index === self.findIndex((d) => d.slug === item.slug),
  );
  return Response.json(unique);
}
