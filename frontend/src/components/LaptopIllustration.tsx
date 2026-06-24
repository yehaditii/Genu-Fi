const LaptopIllustration = () => {
  return (
    <div className="laptop-3d relative">
      <div className="relative h-64 w-96 max-w-full">
        <div className="absolute bottom-0 h-6 w-full rounded-lg bg-gradient-to-r from-cool-blue to-aqua-neon"></div>
        <div className="absolute bottom-6 h-56 w-full rounded-t-lg bg-gradient-to-br from-deep-navy via-cool-blue to-aqua-neon p-4">
          <div className="relative h-full w-full overflow-hidden rounded bg-deep-navy/90 p-4">
            <div className="space-y-2">
              <div className="h-2 w-4/5 animate-pulse rounded bg-aqua-neon/60"></div>
              <div className="h-2 w-3/5 animate-pulse rounded bg-cool-blue/60"></div>
              <div className="h-2 w-11/12 animate-pulse rounded bg-aqua-neon/60"></div>
              <div className="h-2 w-2/3 animate-pulse rounded bg-cool-blue/60"></div>
            </div>
            <div className="absolute bottom-4 right-4 text-sm font-bold text-aqua-neon">GenuFi</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopIllustration;
