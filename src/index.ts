import { Hooks, Plugin } from "@yarnpkg/core";
import { parse } from "dotenv";
import { readFile } from "fs/promises";
import * as path from "path";
import { expandDotenv } from "./expand";

export { plugin as default };
const plugin: Plugin<Hooks> = {
  hooks: {
    async setupScriptEnvironment(project, existingConfig) {
      const dotenvs = (existingConfig["DOTENV"] ?? ".env").split(",");

      const loadedConfig: Record<string, string> = {};

      const load = async (root: string, name: string) => {
        try {
          const dotenvPath = path.resolve(root, name);
          const vars = parse(await readFile(dotenvPath));
          Object.assign(loadedConfig, vars);
        } catch (_) {}
      };

      const workspace = project.tryWorkspaceByCwd(
        project.configuration.startingCwd
      );

      // Load dotenvs for the workspace and the project in order of precedence
      for (const name of dotenvs) {
        await load(project.cwd, name);

        if (workspace) {
          await load(workspace.cwd, name);
        }
      }

      // Expand environment variables
      expandDotenv(loadedConfig, existingConfig);

      // Assign variables to scriptEnv but don't override existing values
      Object.entries(loadedConfig).forEach(([key, value]) => {
        if (!existingConfig.hasOwnProperty(key)) {
          existingConfig[key] = value;
        }
      });
    },
  },
};
