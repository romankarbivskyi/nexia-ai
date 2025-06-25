import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function signOut() {
  "use server";

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
    return;
  }

  redirect("/");
}

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      App {user?.email}
      <form action={signOut}>
        <Button type="submit">Log out</Button>
      </form>
    </div>
  );
}
