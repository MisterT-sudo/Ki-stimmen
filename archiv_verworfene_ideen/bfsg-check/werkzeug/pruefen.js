#!/usr/bin/env node
// BFSG-Check: prüft eine Website automatisch auf Barrierefreiheit (WCAG 2.1/2.2 A + AA, Grundlage der EN 301 549).
// Aufruf: node pruefen.js https://shop.example.de [maxSeiten=6] [ausgabe.json]
// Prüft die Startseite + bis zu (maxSeiten-1) interne Seiten (bevorzugt Produkt, Warenkorb, Kontakt, Kasse).
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const start = process.argv[2];
const maxSeiten = parseInt(process.argv[3] || "6", 10);
const ausgabe = process.argv[4] || "ergebnis.json";
if (!start) { console.error("Aufruf: node pruefen.js <URL> [maxSeiten] [ausgabe.json]"); process.exit(1); }

const WICHTIG = /produkt|product|artikel|shop|warenkorb|cart|kasse|checkout|kontakt|contact|collections|kategorie|category/i;

async function seitePruefen(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(2500);
  await page.addScriptTag({ content: AXE });
  const axe = await page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
      resultTypes: ["violations", "incomplete"],
    });
    const kurz = (v) => ({ id: v.id, impact: v.impact, help: v.help, tags: v.tags,
      anzahl: v.nodes.length,
      beispiele: v.nodes.slice(0, 3).map((n) => ({ ziel: n.target.join(" "), html: n.html.slice(0, 180) })) });
    return { verstoesse: r.violations.map(kurz), unklar: r.incomplete.length };
  });
  // Tastatur: 15x Tab drücken und prüfen, ob der Fokus sichtbar ist
  const tastatur = await page.evaluate(() => null).then(async () => {
    let erreicht = 0, unsichtbar = 0;
    await page.mouse.click(1, 1).catch(() => {});
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const s = getComputedStyle(el);
        const sichtbar = (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== "none";
        return { sichtbar };
      });
      if (info) { erreicht++; if (!info.sichtbar) unsichtbar++; }
    }
    return { erreicht, ohneSichtbarenFokus: unsichtbar };
  });
  const meta = await page.evaluate(() => ({
    titel: document.title, sprache: document.documentElement.lang || "",
    links: Array.from(document.querySelectorAll("a[href]")).map((a) => a.href),
    hatBarrierefreiheitserklaerung: /barrierefreiheit/i.test(document.body.innerText),
  }));
  return { url, ...axe, tastatur, titel: meta.titel, sprache: meta.sprache, links: meta.links,
           hatErklaerungLink: meta.hatBarrierefreiheitserklaerung };
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, locale: "de-DE" });
  const host = new URL(start).host;
  const ergebnisse = [];
  const erste = await seitePruefen(page, start);
  ergebnisse.push(erste);
  const norm = (l) => l.split("#")[0].replace(/\/$/, "");
  const kandidaten = [...new Set(erste.links.map(norm))]
    .filter((l) => { try { const u = new URL(l); return ["http:", "https:", "file:"].includes(u.protocol) && u.host === host && !/\.(pdf|jpe?g|png|zip|webp)$/i.test(u.pathname); } catch { return false; } })
    .filter((l) => l !== norm(start));
  kandidaten.sort((a, b) => (WICHTIG.test(b) ? 1 : 0) - (WICHTIG.test(a) ? 1 : 0));
  for (const url of kandidaten.slice(0, maxSeiten - 1)) {
    try { ergebnisse.push(await seitePruefen(page, url)); }
    catch (e) { ergebnisse.push({ url, fehler: String(e).slice(0, 200) }); }
  }
  await page.goto(start, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  const shot = path.join(path.dirname(path.resolve(ausgabe)), "startseite.png");
  await page.screenshot({ path: shot });
  await browser.close();
  for (const e of ergebnisse) delete e.links;
  fs.writeFileSync(ausgabe, JSON.stringify({ start, datum: new Date().toISOString(), seiten: ergebnisse, screenshot: shot }, null, 2));
  const summe = ergebnisse.reduce((s, e) => s + (e.verstoesse || []).reduce((t, v) => t + v.anzahl, 0), 0);
  console.log(`${ergebnisse.length} Seiten geprüft, ${summe} Fundstellen → ${ausgabe}`);
})();
