// drizzle-kit 1.x writes each migration to drizzle/<timestamp>_<name>/migration.sql;
// drizzle-kit 0.x writes flat drizzle/<timestamp>_<name>.sql files. Both
// `wrangler d1 migrations apply` and @cloudflare/vitest-plugin's readD1Migrations
// only understand a flat migrations/<name>.sql directory. This script syncs the
// former into the latter, idempotently:
//   - lexical file order == chronological order (timestamp prefix)
//   - an existing migrations/*.sql is NEVER rewritten (already-applied
//     migrations must stay byte-identical); a content mismatch prints a drift
//     warning so you can resolve it by hand.
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";

const SRC = "drizzle";
const DEST = "migrations";

if (!existsSync(SRC)) {
	console.error(
		`${SRC}/ not found. Run \`pnpm db:generate\` (drizzle-kit generate) first.`,
	);
	process.exit(1);
}
mkdirSync(DEST, { recursive: true });

/** @type {{ name: string, sqlPath: string }[]} */
const sources = [];
for (const entry of readdirSync(SRC).sort()) {
	if (entry === "meta") continue;
	const full = join(SRC, entry);
	if (statSync(full).isDirectory()) {
		const sqlPath = join(full, "migration.sql");
		if (existsSync(sqlPath)) sources.push({ name: `${entry}.sql`, sqlPath });
	} else if (entry.endsWith(".sql")) {
		// Legacy flat layout (drizzle-kit 0.x).
		sources.push({ name: entry, sqlPath: full });
	}
}

let added = 0;
let drifted = 0;
for (const { name, sqlPath } of sources) {
	const target = join(DEST, name);
	const content = readFileSync(sqlPath);
	if (existsSync(target)) {
		if (!readFileSync(target).equals(content)) {
			drifted++;
			console.warn(
				`! drift: ${target} differs from ${sqlPath}; left untouched. ` +
					"If this migration was never applied anywhere, delete the copy in " +
					`${DEST}/ and re-run; otherwise generate a new migration instead.`,
			);
		}
		continue;
	}
	writeFileSync(target, content);
	added++;
	console.log(`+ ${target}`);
}

if (added)
	console.log(
		`Flattened ${added} migration${added === 1 ? "" : "s"} into ${DEST}/`,
	);
else console.log(`${DEST}/ is up to date`);
if (drifted)
	console.warn(
		`${drifted} drifted migration${drifted === 1 ? " needs" : "s need"} attention`,
	);
