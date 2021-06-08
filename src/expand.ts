export const expandDotenv = (
  loadedConfig: Record<string, string>,
  existingConfig: Record<string, string>
) => {
  const interpolate = (envValue: string): string => {
    const matches = envValue.match(/(.?\${?(?:[a-zA-Z0-9_]+)?}?)/g) || [];

    return matches.reduce((newEnv, match) => {
      const parts = /(.?)\${?([a-zA-Z0-9_]+)?}?/g.exec(match)!;
      const prefix = parts[1];

      let value;
      let replacePart;

      if (prefix === "\\") {
        replacePart = parts[0];
        value = replacePart.replace("\\$", "$");
      } else {
        const key = parts[2];
        replacePart = parts[0].substring(prefix.length);

        // Try value from existing config, then loaded config
        value = existingConfig[key] ?? loadedConfig[key] ?? "";
        // Resolve recursive interpolations
        value = interpolate(value);
      }

      return newEnv.replace(replacePart, value);
    }, envValue);
  };

  for (const key in loadedConfig) {
    const value = existingConfig[key] ?? loadedConfig[key];
    loadedConfig[key] = interpolate(value);
  }
};
