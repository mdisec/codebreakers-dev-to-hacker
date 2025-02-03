import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl mx-auto text-center">
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
          className="mx-auto mb-8"
        />
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Welcome to MDISEC Training.
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Get started by signing in or creating a new account
        </p>        
      </main>
    </div>
  );
}
