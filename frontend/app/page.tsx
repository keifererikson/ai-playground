import { Gemini } from '@lobehub/icons';

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Gemini size={64} className="text-primary" />
        <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-fuchsia-800 bg-clip-text text-transparent">
          AI Playground
        </h1>
        <p>A playground to test out many different AI providers and models.</p>
      </main>
    </div>
  );
}
