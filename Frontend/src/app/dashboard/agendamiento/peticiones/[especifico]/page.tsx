import ScheduleRequestsPage from "../../components/main-petitions";

export default async function Page({
  params,
}: {
  params: Promise<{ especifico: string }>;
}) {
  const { especifico } = await params;

    const today = new Date();
    return <ScheduleRequestsPage box = {especifico} date = {today}></ScheduleRequestsPage>;
}