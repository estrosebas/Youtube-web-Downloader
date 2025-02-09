import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import './styles/VideoInput.css';

interface VideoInputProps {
  onFetch: (url: string) => void;
}

const VideoInput = ({ onFetch }: VideoInputProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) return;
    onFetch(url);
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex gap-2">
      <Form.Control
        type="text"
        placeholder="Ingrese la URL del video"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-grow-1"
      />
      <Button type="submit" variant="primary">
        Buscar Formatos
      </Button>
    </Form>
  );
};

export default VideoInput;