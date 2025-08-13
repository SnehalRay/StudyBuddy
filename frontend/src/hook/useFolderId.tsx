// src/hooks/useFolderId.ts
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/axios';

type FolderInfo = { id: string; name?: string };

export default function useFolderId() {
  const [folderId, setFolderId]   = useState<string | null>(null);
  const [loading, setLoading]     = useState<boolean>(false);
  const [error, setError]         = useState<string | null>(null);

  const fetchFolderId = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // path is /folder/listCurrentFolderId
      const res = await api.get<FolderInfo>('/folder/listCurrentFolderId', {
        withCredentials: true, // ensure cookies are sent (jwt + folderSession)
      });
      if (!res.data?.id) throw new Error('Response missing "id".');
      setFolderId(String(res.data.id));
    } catch (e: any) {
      const msg =
        e?.response?.data || e?.message || 'Failed to resolve current folder ID.';
      setError(typeof msg === 'string' ? msg : 'Failed to resolve current folder ID.');
      setFolderId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFolderId();
  }, [fetchFolderId]);

  return { folderId, loading, error, refresh: fetchFolderId };
}
