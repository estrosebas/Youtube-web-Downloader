import { useState } from "react";
import axios from "axios";
import { Container, Alert } from "react-bootstrap";
import VideoInput from "../components/VideoInput";
import VideoList from "../components/VideoList";
import '../components/styles/Home.css';

interface Format {
  format_id: string;
  details: string;
  url: string;
  ext: string;
  type: "video" | "audio";
}

interface FormatsResponse {
  videoFormats: Format[];
  audioFormats: Format[];
  error?: string;
}
const API_BASE_URL = "https://estrotools.ooguy.com:5021";

const Home = () => {
  const [formats, setFormats] = useState<FormatsResponse>({
    videoFormats: [],
    audioFormats: [],
  });
  const [error, setError] = useState("");

  const fetchFormats = async (url: string) => {
    try {
      setError("");
      const response = await axios.get<FormatsResponse>(
        `${API_BASE_URL}/api/formats?url=${encodeURIComponent(url)}`
      );

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setFormats({
          videoFormats: response.data.videoFormats,
          audioFormats: response.data.audioFormats,
        });
      }
    } catch (err) {
      setError("Error al obtener los formatos. Inténtelo de nuevo.");
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Descargar Videos</h1>
      <VideoInput onFetch={fetchFormats} />
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      <VideoList videoFormats={formats.videoFormats} audioFormats={formats.audioFormats} />
    </Container>
  );
};

export default Home;
