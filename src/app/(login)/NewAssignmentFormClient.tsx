'use client';

import React, { useState } from 'react';
import { api } from '~/trpc/react';
import { assignmentTypeEnum } from '@katitb2024/database';
import { FolderEnum } from '~/server/bucket';

const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB in bytes

export function NewAssignmentFormClient() {
  const [formData, setFormData] = useState({
    judul: '',
    assignmentType: assignmentTypeEnum.enumValues[0],
    point: '',
    waktuMulai: '',
    waktuSelesai: '',
    deskripsi: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(null);

  const uploadFileMutation = api.storage.uploadFile.useMutation();
  const createAssignmentMutation = api.assignment.uploadNewAssignmentMamet.useMutation();
  const downloadFileQuery = api.storage.downloadFile.useQuery(
    { key: uploadedFileKey || '' },
    { enabled: false }
  );

  const isSubmitting = createAssignmentMutation.status === 'pending' || uploadFileMutation.status === 'pending';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!ALLOWED_FORMATS.includes(selectedFile.type)) {
        setStatus('Invalid file format. Please select a JPEG, PNG, PDF, or DOCX file.');
        setFile(null);
      } else if (selectedFile.size > MAX_FILE_SIZE) {
        setStatus('File is too large. Maximum size is 20 MB.');
        setFile(null);
      } else {
        setFile(selectedFile);
        setStatus('File selected. Ready to upload.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting assignment...');

    try {
      let fileKey = '';
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (e.target && e.target.result) {
            const base64Content = e.target.result.toString().split(',')[1];
            const uploadResult = await uploadFileMutation.mutateAsync({
              folder: FolderEnum.ASSIGNMENT_MAMET,
              fileName: file.name,
              fileContent: base64Content!,
            });
            fileKey = uploadResult.split('/').slice(-2).join('/'); // Extract the key from the URL

            // Now that we have the file key, submit the assignment
            const submittedFileKey = await submitAssignment(fileKey);
            if (submittedFileKey) {
              setUploadedFileKey(submittedFileKey);
            }
          }
        };
        reader.readAsDataURL(file);
      } else {
        // If no file, submit the assignment directly
        await submitAssignment();
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Failed to submit assignment. Please try again.');
    }
  };

  const submitAssignment = async (fileKey?: string) => {
    try {
      const result = await createAssignmentMutation.mutateAsync({
        ...formData,
        file: fileKey,
        point: formData.point ? parseInt(formData.point) : undefined,
        waktuMulai: formData.waktuMulai ? new Date(formData.waktuMulai) : undefined,
        waktuSelesai: new Date(formData.waktuSelesai),
      });
      setStatus(`Assignment created successfully. ID: ${result!.id}`);
      return fileKey;
    } catch (error) {
      console.error('Error creating assignment:', error);
      setStatus('Failed to create assignment. Please try again.');
      return null;
    }
  };

  const handleDownload = async () => {
    if (uploadedFileKey) {
      try {
        const result = await downloadFileQuery.refetch();
        if (result.data) {
          const blob = base64ToBlob(result.data.content, result.data.contentType);
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = result.data.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          throw new Error('Failed to download file');
        }
      } catch (error) {
        console.error('Error downloading file:', error);
        setStatus('Failed to download file. Please try again.');
      }
    }
  };

  const handleOpenInNewTab = async () => {
    if (uploadedFileKey) {
      try {
        const result = await downloadFileQuery.refetch();
        if (result.data) {
          const blob = base64ToBlob(result.data.content, result.data.contentType);
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          // Note: We're not revoking the URL here as it needs to persist for the new tab
        } else {
          throw new Error('Failed to open file');
        }
      } catch (error) {
        console.error('Error opening file:', error);
        setStatus('Failed to open file. Please try again.');
      }
    }
  };

  const base64ToBlob = (base64: string, contentType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="judul" className="block">Title:</label>
        <input
          type="text"
          id="judul"
          name="judul"
          value={formData.judul}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="assignmentType" className="block">Assignment Type:</label>
        <select
          id="assignmentType"
          name="assignmentType"
          value={formData.assignmentType}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        >
          {assignmentTypeEnum.enumValues.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="point" className="block">Point:</label>
        <input
          type="number"
          id="point"
          name="point"
          value={formData.point}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="waktuMulai" className="block">Start Time:</label>
        <input
          type="datetime-local"
          id="waktuMulai"
          name="waktuMulai"
          value={formData.waktuMulai}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="waktuSelesai" className="block">End Time:</label>
        <input
          type="datetime-local"
          id="waktuSelesai"
          name="waktuSelesai"
          value={formData.waktuSelesai}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="deskripsi" className="block">Description:</label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="file" className="block">File:</label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          accept=".jpeg,.jpg,.png,.pdf,.docx"
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Create Assignment'}
      </button>

      {uploadedFileKey && (
        <div className="mt-4 space-x-2">
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Download File
          </button>
          <button
            type="button"
            onClick={handleOpenInNewTab}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Open in New Tab
          </button>
        </div>
      )}

      {status && (
        <div className="mt-4 p-2 bg-gray-100 border rounded">
          Status: {status}
        </div>
      )}
    </form>
  );
}