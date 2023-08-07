// Home page definitions
export default function ErrorPage() {
  // Render content
  return (
    <div
      className="relative flex h-screen w-screen flex-col items-center
      justify-center gap-3"
    >
      <div
        className="bg-gradient-to-tr from-deepOcean to-sky bg-clip-text
        text-[500px] font-bold text-transparent"
      >
        ERROR
      </div>
      <div className="text-5xl">Refresh or Go Back a Page</div>
    </div>
  );
}
