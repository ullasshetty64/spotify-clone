import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongsByUserId = async () => {
  // 1. Await the cookies (Critical fix for Next.js 15+)
  const cookieStore = await cookies();

  // 2. Pass the resolved cookieStore to Supabase
  const supabase = createServerComponentClient({
    cookies: () => cookieStore
  });

  const {
    data: sessionData,
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.log(sessionError.message);
    return [];
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('user_id', sessionData.session?.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data) || [];
};

export default getSongsByUserId;