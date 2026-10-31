import { parseArgs } from "node:util";
import * as p from "@clack/prompts";
import { init } from "./commands/init.ts";
import { CliError } from "./utils/ui.ts";

const HELP = `Usage: cl <command> [options]

Commands
  init            Set up cl.json, the theme and the cn() helper

Options
  -c, --cwd       Project folder (default: current folder)
  -y, --yes       Use the defaults, no questions
  -f, --force     Overwrite an existing cl.json
  --style         tailwind | css (default: detected)
  --registry      Registry URL or folder
  --skip-install  Don't install npm packages
  -h, --help      Show this help`;

async function main() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      cwd: { type: "string", short: "c", default: process.cwd() },
      yes: { type: "boolean", short: "y", default: false },
      force: { type: "boolean", short: "f", default: false },
      style: { type: "string" },
      registry: { type: "string" },
      "skip-install": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });

  const [command] = positionals;
  if (values.help || !command) return console.log(HELP);

  switch (command) {
    case "init":
      return init({
        cwd: values.cwd,
        yes: values.yes,
        force: values.force,
        skipInstall: values["skip-install"],
        style: values.style,
        registry: values.registry,
      });
    default:
      throw new CliError(`Unknown command "${command}".\n\n${HELP}`);
  }
}

main().catch((error: unknown) => {
  // Expected problems get a plain message; set DEBUG=1 for the stack of anything else.
  const show =
    error instanceof Error && (error instanceof CliError || !process.env.DEBUG)
      ? error.message
      : error instanceof Error
        ? (error.stack ?? error.message)
        : String(error);
  p.log.error(show);
  process.exit(1);
});
