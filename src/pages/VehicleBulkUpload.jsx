import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function VehicleBulkUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert('Select a file first');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setResult(null);
      const token = localStorage.getItem('token');
      
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vehicles/bulk-upload`, 
        formData, 
        {
          headers: { 
            'Content-Type': 'multipart/form-data', 
            'Authorization': `Bearer ${token}` 
          },
          timeout: 120000, // Increased to 2 minutes for large files
        }
      );
      
      setResult(res.data);
      
      // Show detailed success message
      const successMessage = `
Success: ${res.data.message}

Details:
- Created: ${res.data.created} vehicles
- Total Processed: ${res.data.totalProcessed} rows
- Skipped: ${res.data.totalSkipped || 0} rows
${res.data.errors ? `- Errors: ${res.data.errors}` : ''}
${res.data.totalRowsInFile ? `- Total in file: ${res.data.totalRowsInFile}` : ''}
      `.trim();

      alert(successMessage);
      
      // Reset file input
      setFile(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Upload failed';
      
      // Show detailed error message
      const detailedError = `
Upload failed: ${errorMessage}

${err.response?.data?.detailedErrors ? 
  `First few errors:\n${err.response.data.detailedErrors.map(e => `- ${e.vehicleNo}: ${e.error}`).join('\n')}` 
  : ''
}
      `.trim();
      
      alert(detailedError);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">
            Vehicle Bulk Upload
          </h2>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Upload Excel file (.xlsx, .xls) with vehicle data
            </p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="border border-gray-300 rounded px-4 py-2 w-full mb-2"
              disabled={uploading}
            />
            {file && (
              <div className="text-sm text-green-600">
                <p>Selected: {file.name}</p>
                <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-2 px-4 rounded font-semibold transition ${
              !file || uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Vehicles'}
          </button>

          {uploading && (
            <div className="mt-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Processing file... This may take a minute for large files.</p>
            </div>
          )}

          {result && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-semibold text-green-800 mb-2">Upload Results:</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p>Created: <strong>{result.created}</strong> vehicles</p>
                <p>Processed: <strong>{result.totalProcessed}</strong> rows</p>
                {result.totalSkipped > 0 && (
                  <p>Skipped: <strong>{result.totalSkipped}</strong> rows</p>
                )}
                {result.errors > 0 && (
                  <p className="text-red-600">Errors: <strong>{result.errors}</strong></p>
                )}
                {result.totalRowsInFile && (
                  <p>Total in file: <strong>{result.totalRowsInFile}</strong> rows</p>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">File Requirements:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Excel (.xlsx, .xls) or CSV format</li>
              <li>• First row must contain headers</li>
              <li>• Required column: <strong>VEH NO</strong></li>
              <li>• Maximum file size: 10MB</li>
              <li>• Large files may take several minutes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}