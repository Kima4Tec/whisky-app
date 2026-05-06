export async function GET() {
  const res = await fetch("https://whiskyhunter.net/api/distilleries_info/");
  const data = await res.json();
  const unique = data.filter(
    (item: any, index: number, self: any[]) =>
      index === self.findIndex((d) => d.slug === item.slug),
  );
  return Response.json(unique);
}
