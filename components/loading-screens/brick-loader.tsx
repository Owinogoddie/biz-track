
export const BrickLoader = () => {
  const bricks = Array.from({ length: 9 });
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-8 bg-card p-8 rounded-lg shadow-lg animate-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-3 gap-1">
          {bricks.map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-primary rounded-sm animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
        <div className="space-y-2 text-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
          <p className="text-lg font-medium text-foreground">Building your workspace</p>
          <p className="text-sm text-muted-foreground">Laying the foundation...</p>
        </div>
      </div>
    </div>
  );
};