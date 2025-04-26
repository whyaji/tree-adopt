import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function ImageForm(props: {
  file: File | null;
  setFile: (file: File | null) => void;
  imageUrl?: string;
}) {
  const { file, setFile, imageUrl } = props;
  return (
    <div>
      <div className="flex flex-col gap-2">
        <Label>Upload Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              setFile(files[0]);
            }
          }}
        />
      </div>
      {file && <p className="text-sm text-gray-500">{file.name}</p>}
      <p className="text-sm text-gray-500">Max size: 5MB</p>
      <p className="text-sm text-gray-500">Accepted formats: jpg, png</p>
      {(file || imageUrl) && (
        <div className="mt-1">
          <img
            src={file ? URL.createObjectURL(file) : imageUrl}
            alt="Preview"
            className="h-48 object-cover rounded-md"
          />
          {file && (
            <Button type="button" className="mt-2" onClick={() => setFile(null)}>
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
