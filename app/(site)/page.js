import getSongs from "@/actions/getSongs";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import PageContent from "@/components/PageContent";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"; // <--- Import 1
import { cookies } from "next/headers"; // <--- Import 2

export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();

  // --- NEW LOGIC: Check if user is logged in ---
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore
  });
  
  const {
    data: { session }
  } = await supabase.auth.getSession();
  // ---------------------------------------------

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">
            {/* DYNAMIC TITLE */}
            {session ? "Welcome Back" : "Welcome to Spotify"}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem 
              image="/images/liked.png" 
              name="Liked Songs" 
              href="liked" 
            />
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            Newest Songs
          </h1>
        </div>
        <div>
          <PageContent songs={songs} />
        </div>
      </div>
    </div>
  )
}