import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
      <h1 className="text-7xl md:text-9xl font-display font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-p3mid pr-10">
        404
      </h1>
      <p className="mt-4 text-xl text-p3cyan font-light tracking-widest">
        TARGET NOT FOUND
      </p>
      <Link
        href="/"
        className="mt-8 inline-block transform -skew-x-12 bg-p3blue px-6 py-2 text-white font-mono text-sm uppercase tracking-wider hover:bg-p3cyan hover:text-black transition-colors"
      >
        <span className="inline-block skew-x-12">Return to Base</span>
      </Link>
    </div>
  );
}
