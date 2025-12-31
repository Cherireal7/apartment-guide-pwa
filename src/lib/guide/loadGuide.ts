
import { promises as fs } from "fs";
import path from "path";
import { Guide } from "./types";

export async function loadGuide(slug: string): Promise<Guide | null> {
    try {
        console.log("Loading guide for slug:", slug);
        const filePath = path.join(process.cwd(), "public", "guides", slug, "guide.json");
        console.log("File path:", filePath);

        const raw = await fs.readFile(filePath, "utf-8");
        const guide = JSON.parse(raw) as Guide;
        console.log("Guide loaded successfully");
        return guide;
    } catch (error) {
        console.error("Error loading guide:", error);
        return null;
    }
}
