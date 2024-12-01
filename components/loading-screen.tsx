
export const LoadingScreen = () => {
  
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-8 bg-card p-8 rounded-lg shadow-lg animate-in slide-in-from-bottom-4 duration-500">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-primary animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] delay-300" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] delay-600" />
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-primary/20 animate-pulse" />
            </div>
            <div className="space-y-2 text-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
              <p className="text-lg font-medium text-foreground">Preparing your space</p>
              <p className="text-sm text-muted-foreground">Creating ripples of innovation...</p>
            </div>
          </div>
        </div>
      );
    };