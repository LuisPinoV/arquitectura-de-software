import { MainFormScheduling } from "../components/main-form";

export default async function Page({
  params,
}: {
  params: Promise<{ especifico: string }>;
}) {
  const { especifico } = await params;

  return (
    <div>
      <MainFormScheduling box = {especifico}/>
    </div>
  );
}
