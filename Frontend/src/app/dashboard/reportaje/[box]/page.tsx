import MainBoxSpecific from "./components/main-box-specific";

export default async function Page({
  params,
}: {
  params: Promise<{ box: string }>;
}) {
  const { box } = await params;
  

  return (
    <MainBoxSpecific box = {box}></MainBoxSpecific>
  );
}
