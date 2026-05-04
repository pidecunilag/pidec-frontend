import { apiClient } from '../client';

export const exportsApi = {
  async exportStudents() {
    const response = await apiClient.get('/admin/export/students', {
      responseType: 'blob',
    });
    return response.data as Blob;
  },

  async exportTeams() {
    const response = await apiClient.get('/admin/export/teams', {
      responseType: 'blob',
    });
    return response.data as Blob;
  },

  async exportSubmissions(stage?: number) {
    const response = await apiClient.get('/admin/export/submissions', {
      params: stage ? { stage } : undefined,
      responseType: 'blob',
    });
    return response.data as Blob;
  },

  async exportScores() {
    const response = await apiClient.get('/admin/export/scores', {
      responseType: 'blob',
    });
    return response.data as Blob;
  },
};

/**
 * Trigger a browser download from a Blob response.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
