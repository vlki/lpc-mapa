export const publicUrl = (path) => {
  return process.env.NODE_ENV === "production"
    ? `https://vlki.github.io/lpc-mapa/${path}`
    : path;
};
