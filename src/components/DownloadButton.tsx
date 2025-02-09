import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import './styles/DownloadButton.css';

interface DownloadButtonProps {
  url?: string;
}

const DownloadButton = ({ url }: DownloadButtonProps) => {
  if (!url) return null;

  return (
    <a className="btn btn-success d-flex align-items-center" href={url} download>
      <FontAwesomeIcon icon={faDownload} className="me-2" /> Descargar
    </a>
  );
};

export default DownloadButton;