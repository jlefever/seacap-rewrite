import { createSwaggerSpec } from "./server";
import { writeFileSync } from "fs";

(async () => {
    const spec = await createSwaggerSpec();
    writeFileSync("./dist/swagger.json", JSON.stringify(spec));
})();
