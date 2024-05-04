import { CalendarView } from "@/features/CalendarView";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const exercises = await supabase.from("exercises").select("*");

  return (
    <main className="flex min-h-screen flex-col items-center font-mono py-2 px-6">
      <CalendarView savedExercises={exercises.data} />
    </main>
  );
}
