import { $require } from "dequanto/utils/$require";

async function main() {

    let resp = await fetch('http://localhost:3000/api/c/read/AppVersionManager/package');
    let json = await resp.json();
    $require.eq(json.version, '1');
}

main().then(() => {
    process.exit(0);  // Exit with success status
});
