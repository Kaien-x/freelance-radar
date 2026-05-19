import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProfileAPI
} from '../../api/user.api';

export default function Resume() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileAPI,
  });

  const user = data?.data;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resume</h1>
        <p className="text-gray-500 text-sm mt-1">Upload and manage your resume</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-8">
        {!user?.resume?.path.length > 0 && (
          <p className="text-center text-gray-500">Resume upload page coming soon...</p>
        )}:{(
          <div className="w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={`http://localhost:8008${user?.resume?.path}`}
              title="PDF Viewer"
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
