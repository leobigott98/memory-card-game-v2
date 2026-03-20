export async function preloadImages(paths: string[]): Promise<void> {
  await Promise.all(
    paths.map(
      (path) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
          img.src = path;
        }),
    ),
  );
}