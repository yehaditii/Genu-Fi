const RotatingCube = () => {
  return (
    <div className="relative h-32 w-32">
      <div className="cube-3d absolute inset-0 mx-auto">
        <div className="cube-face"></div>
        <div className="cube-face"></div>
        <div className="cube-face"></div>
        <div className="cube-face"></div>
        <div className="cube-face"></div>
        <div className="cube-face"></div>
      </div>
    </div>
  );
};

export default RotatingCube;
