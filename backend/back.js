import https from "https";
import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// SSL
const privateKey = fs.readFileSync("/etc/letsencrypt/live/estrotools.ooguy.com/privkey.pem", "utf8");
const certificate = fs.readFileSync("/etc/letsencrypt/live/estrotools.ooguy.com/fullchain.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

const DOWNLOADS_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR);
}

const USER_AGENT = `"Mozilla/5.0 (Linux; U; Android 10; en; SM-J600G Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.10.0.1163 UCTurbo/1.9.8.900 Mobile Safari/537.36"`;
const COOKIES_CMD = "--cookies-from-browser firefox";


app.get("/api/formats", (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  // Ejecutar yt-dlp con mejor video+audio y mejor audio
  const command = `yt-dlp ${COOKIES_CMD} --user-agent ${USER_AGENT} -f "bv*+ba/best[ext=mp4]/bestaudio[ext=m4a]/bestaudio[ext=mp3]" --print-json ${url}`;

  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).json({ error: stderr });

    try {
      const data = JSON.parse(stdout);

      // Buscar el mejor formato de video con audio
      const bestVideo = data.formats.find((format) => format.vcodec !== "none" && format.acodec !== "none" && format.ext === "mp4");

      // Buscar el mejor formato de audio (M4A o MP3)
      const bestAudio = data.formats.find((format) => format.vcodec === "none" && ["m4a", "mp3"].includes(format.ext));

      const videoFormats = bestVideo
        ? [{
            format_id: bestVideo.format_id,
            details: `MP4 - ${bestVideo.resolution || "Video"} - ${bestVideo.filesize ? (bestVideo.filesize / (1024 * 1024)).toFixed(2) + "MB" : "Tamaño desconocido"}`,
            url,
            ext: "mp4",
            type: "video",
          }]
        : [];

      const audioFormats = bestAudio
        ? [{
            format_id: bestAudio.format_id,
            details: `M4A - Audio - ${bestAudio.filesize ? (bestAudio.filesize / (1024 * 1024)).toFixed(2) + "MB" : "Tamaño desconocido"}`,
            url,
            ext: "m4a",
            type: "audio",
          }]
        : [];

      res.json({ videoFormats, audioFormats });

    } catch (parseError) {
      res.status(500).json({ error: "Error parsing response" });
    }
  });
});


app.get("/api/download/video", (req, res) => {
  const url = req.query.url;
  const format_id = req.query.format_id;
  if (!url || !format_id) return res.status(400).json({ error: "No URL or format_id provided" });

  const filename = `video_${Date.now()}.mp4`;
  const filePath = path.join(DOWNLOADS_DIR, filename);
  const command = `yt-dlp ${COOKIES_CMD} --user-agent ${USER_AGENT} -f ${format_id} -o "${filePath}" ${url}`;

  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).json({ error: stderr });

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) return res.status(500).json({ error: "File not found" });
      res.download(filePath, filename);
    });
  });
});

app.get("/api/download/audio", (req, res) => {
  const url = req.query.url;
  const format_id = req.query.format_id;
  if (!url || !format_id) return res.status(400).json({ error: "No URL or format_id provided" });

  const filename = `audio_${Date.now()}.mp3`;
  const filePath = path.join(DOWNLOADS_DIR, filename);
  const command = `yt-dlp ${COOKIES_CMD} --user-agent ${USER_AGENT} -f ${format_id} -x --audio-format mp3 -o "${filePath}" ${url}`;

  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).json({ error: stderr });

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) return res.status(500).json({ error: "File not found" });
      res.download(filePath, filename);
    });
  });
});

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(5021, () => {
  console.log("Servidor HTTPS corriendo en el puerto 5021");
});
