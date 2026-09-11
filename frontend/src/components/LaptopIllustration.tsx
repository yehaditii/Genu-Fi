const LaptopIllustration = () => {
  return (
    <div className="laptop-3d relative w-full max-w-[320px] sm:max-w-sm">
      <div className="relative h-56 w-full sm:h-64">
        <div className="absolute bottom-0 h-5 w-full rounded-lg bg-gradient-to-r from-cool-blue to-aqua-neon sm:h-6"></div>
        <div className="absolute bottom-5 h-48 w-full rounded-t-lg bg-gradient-to-br from-deep-navy via-cool-blue to-aqua-neon p-3 sm:bottom-6 sm:h-56 sm:p-4">
          <div className="relative h-full w-full overflow-hidden rounded bg-deep-navy/90 p-3 sm:p-4">
            <div className="space-y-2">
              <div className="h-2 w-4/5 animate-pulse rounded bg-aqua-neon/60"></div>
              <div className="h-2 w-3/5 animate-pulse rounded bg-cool-blue/60"></div>
              <div className="h-2 w-11/12 animate-pulse rounded bg-aqua-neon/60"></div>
              <div className="h-2 w-2/3 animate-pulse rounded bg-cool-blue/60"></div>
            </div>
            <div className="absolute bottom-3 right-3 text-xs font-bold text-aqua-neon sm:bottom-4 sm:right-4 sm:text-sm">GenuFi</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopIllustration;
