
interface MediaPreviewProps {
  url: string;
  type: 'image' | 'video' | 'file';
}

export function MediaPreview({ url, type }: MediaPreviewProps) {
  if (type === 'image') {
    return (
      <img
        src={url}
        alt="Shared media"
        className="rounded-lg mb-2 max-w-full"
        loading="lazy"
      />
    );
  }

  if (type === 'video') {
    return (
      <video
        src={url}
        controls
        className="rounded-lg mb-2 max-w-full"
      />
    );
  }

  // For unknown file types
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline"
    >
      Open File
    </a>
  );
}
