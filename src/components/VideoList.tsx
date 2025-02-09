import { ListGroup, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import "./styles/VideoList.css";

interface Format {
  format_id: string;
  details: string;
  url: string;
  ext: string;
  type: "video" | "audio";
}

interface VideoListProps {
  videoFormats?: Format[];
  audioFormats?: Format[];
}

const VideoList: React.FC<VideoListProps> = ({ videoFormats = [], audioFormats = [] }) => {
  const handleDownload = (url: string, format_id: string, type: "video" | "audio") => {
    let endpoint = "";
    
    if (type === "video") {
      endpoint = `/api/download/video?url=${encodeURIComponent(url)}&format_id=${format_id}`;
    } else {
      endpoint = `/api/download/audio?url=${encodeURIComponent(url)}&format_id=${format_id}`;
    }

    //window.location.href = `http://localhost:5000${endpoint}`;
    window.location.href = `https://estrotools.ooguy.com:5021${endpoint}`;
  };

  return (
    <div className="mt-4">
      {videoFormats.length > 0 && (
        <Card className="mb-4">
          <Card.Header>Formatos de Video</Card.Header>
          <ListGroup variant="flush">
            {videoFormats.map((format, index) => (
              <ListGroup.Item key={`video-${index}`} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Formato:</strong> {format.details}
                </div>
                <Button variant="primary" onClick={() => handleDownload(format.url, format.format_id, format.type)}>
                  <FontAwesomeIcon icon={faDownload} className="me-2" /> Descargar Video
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
      {audioFormats.length > 0 && (
        <Card>
          <Card.Header>Formatos de Audio</Card.Header>
          <ListGroup variant="flush">
            {audioFormats.map((format, index) => (
              <ListGroup.Item key={`audio-${index}`} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Formato:</strong> {format.details}
                </div>
                <Button variant="success" onClick={() => handleDownload(format.url, format.format_id, format.type)}>
                  <FontAwesomeIcon icon={faDownload} className="me-2" /> Descargar Audio
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </div>
  );
};

export default VideoList;