export function logInfo(message: string, data?: any) {
    console.log(
      JSON.stringify({
        level: "INFO",
        time: new Date().toISOString(),
        message,
        data,
      })
    );
  }
  
  export function logError(message: string, error?: any) {
    console.error(
      JSON.stringify({
        level: "ERROR",
        time: new Date().toISOString(),
        message,
        error: error?.message || error,
      })
    );
  }
  
  export function logPerf(label: string, durationMs: number) {
    console.log(
      JSON.stringify({
        level: "PERF",
        time: new Date().toISOString(),
        label,
        durationMs,
      })
    );
  }
  