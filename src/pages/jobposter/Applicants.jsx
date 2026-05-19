import { useParams } from 'react-router-dom';

export default function Applicants() {
  const { jobId } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applicants for Job {jobId}</h1>
        <p className="text-gray-500 text-sm mt-1">Review and manage applications</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-8">
        <p className="text-center text-gray-500">Applicants page coming soon...</p>
      </div>
    </div>
  );
}
