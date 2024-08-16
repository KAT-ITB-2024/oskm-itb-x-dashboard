'use client';
import React, { useState } from 'react';
import { api } from '~/trpc/react';
import { assignmentTypeEnum } from '@katitb2024/database';
import { FolderEnum } from '~/server/bucket';

const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB in bytes

function NewAssignmentForm() {
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

  const uploadFileMutation = api.storage.uploadFile.useMutation();
  const createAssignmentMutation = api.assignment.uploadNewAssignmentMamet.useMutation();
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
      let fileUrl = '';
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
            fileUrl = uploadResult;

            // Now that we have the file URL, submit the assignment
            await submitAssignment(fileUrl);
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

  const submitAssignment = async (fileUrl?: string) => {
    try {
      const result = await createAssignmentMutation.mutateAsync({
        ...formData,
        file: fileUrl,
        point: formData.point ? parseInt(formData.point) : undefined,
        waktuMulai: formData.waktuMulai ? new Date(formData.waktuMulai) : undefined,
        waktuSelesai: new Date(formData.waktuSelesai),
      });
      setStatus(`Assignment created successfully. ID: ${result!.id}`);
      // Reset form or redirect as needed
    } catch (error) {
      console.error('Error creating assignment:', error);
      setStatus('Failed to create assignment. Please try again.');
    }
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

      {status && (
        <div className="mt-4 p-2 bg-gray-100 border rounded">
          Status: {status}
        </div>
      )}
    </form>
  );
}

export default NewAssignmentForm;