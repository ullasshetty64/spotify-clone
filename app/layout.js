import { Figtree } from 'next/font/google';
import Player from '@/components/Player'
import Sidebar from '@/components/Sidebar';
import SupabaseProvider from '@/providers/SupabaseProvider'; // <--- IMPORT THIS
import UserProvider from '@/providers/UserProvider'
import ModalProvider from '@/providers/ModalProvider';
import ToasterProvider from '@/providers/ToasterProvider'
import getSongsByUserId from '@/actions/getSongsByUserId'
import './globals.css';

const font = Figtree({ subsets: ['latin'] });

export const metadata = {
  title: 'Spotify Clone',
  description: 'Listen to music!',
};

export default async function RootLayout({ children }) {
  // 2. Fetch the songs
  const userSongs = await getSongsByUserId();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>  
            <ModalProvider />
            {/* 3. Pass the songs to the Sidebar */}
            <Sidebar songs={userSongs}>
              {children}
            </Sidebar>
            <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}