import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function ImageForm(props: {
  label?: string;
  required?: boolean;
  files: (File | string)[];
  setFiles: (files: File[]) => void;
  maxFiles?: number;
}) {
  const { files, setFiles, label, maxFiles } = props;

  // Helper to get preview URL for File or string
  const getPreviewUrl = (fileOrUrl: File | string) =>
    typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl);

  // Remove file by index
  const handleRemove = (idx: number) => {
    setFiles(files.filter((f, i) => typeof f !== 'string' && i !== idx) as File[]);
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <Label>
          {label}
          {props.required ? <Label className="text-red-500">*</Label> : ''}
        </Label>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const inputFiles = e.target.files;
            if (inputFiles) {
              const newFiles = Array.from(inputFiles);
              // Only allow up to maxFiles
              const totalFiles = [...files.filter((f) => f instanceof File), ...newFiles].slice(
                0,
                maxFiles
              );
              setFiles(totalFiles as File[]);
            }
          }}
          disabled={maxFiles !== undefined && files.length >= maxFiles}
        />
      </div>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-2">
          {files.map((file, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <img
                src={getPreviewUrl(file)}
                alt={`Preview ${idx}`}
                className="h-32 w-32 object-cover rounded-md"
              />
              {typeof file !== 'string' && (
                <p className="text-xs text-gray-500 mt-1">{file.name}</p>
              )}
              <Button type="button" className="mt-1" onClick={() => handleRemove(idx)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
      <p className="text-sm text-gray-500">Max size: 5MB</p>
      <p className="text-sm text-gray-500">Accepted formats: jpg, png</p>
      {maxFiles && (
        <p className="text-xs text-gray-400">
          {files.length}/{maxFiles} images selected
        </p>
      )}
    </div>
  );
}
