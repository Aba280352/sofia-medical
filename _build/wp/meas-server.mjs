import http from "http"; import fs from "fs";
http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Private-Network", "true");
  if (req.method === "OPTIONS") { res.end(); return; }
  let b = ""; req.on("data", (d) => (b += d)); req.on("end", () => {
    const name = new URL(req.url, "http://x").searchParams.get("n") || "m";
    fs.writeFileSync("meas/" + name + ".json", b); res.end("ok " + b.length);
  });
}).listen(5190, () => console.log("meas on 5190"));
