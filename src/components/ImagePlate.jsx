import './ImagePlate.css';

/**
 * Shows an uploaded image, or a styled placeholder (matching the prototype's
 * image-slot look) when the admin hasn't uploaded one yet.
 */
export default function ImagePlate({ src, alt = '', placeholder = 'No image yet', className = '' }) {
  if (src) {
    return <img src={src} alt={alt} className={`image-plate__img ${className}`} />;
  }
  return (
    <div className={`image-plate__placeholder ${className}`}>
      <span className="image-plate__placeholder-icon" aria-hidden="true">◇</span>
      <span>{placeholder}</span>
    </div>
  );
}
