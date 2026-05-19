import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyProposalsAPI, generateProposalAPI, updateProposalAPI, deleteProposalAPI } from '../../api/proposals.api';
import { format } from 'date-fns';
import { Sparkles, Trash2, Star, Copy, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import ProposalModal from '../../components/proposal/ProposalModal';

const toneColors = {
  professional: 'bg-blue-50 text-blue-700',
  friendly: 'bg-green-50 text-green-700',
  technical: 'bg-purple-50 text-purple-700',
  creative: 'bg-orange-50 text-orange-700',
};

export default function Proposals() {
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['proposals', filter],
    queryFn: () => getMyProposalsAPI(filter === 'all' ? {} : { tone: filter }),
  });

  const proposals = data?.data?.proposals || [];

  const generateMutation = useMutation({
    mutationFn: generateProposalAPI,
    onSuccess: () => {
      toast.success('Proposal generated');
      setShowModal(false);
      queryClient.invalidateQueries(['proposals']);
    },
    onError: () => toast.error('Failed to generate proposal'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProposalAPI(id, data),
    onSuccess: () => {
      toast.success('Proposal updated');
      queryClient.invalidateQueries(['proposals']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProposalAPI,
    onSuccess: () => {
      toast.success('Proposal deleted');
      queryClient.invalidateQueries(['proposals']);
    },
  });

  const handleGenerate = (jobId, jobTitle, jobDescription) => {
    setSelectedJob({ jobId, jobTitle, jobDescription });
    setShowModal(true);
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proposals</h1>
          <p className="text-gray-500 text-sm mt-1">AI-generated proposals for your applications</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Proposal
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'professional', 'friendly', 'technical', 'creative'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 text-sm rounded-lg border capitalize transition-colors ${
              filter === t
                ? 'bg-violet-600 text-white border-violet-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : proposals.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No proposals yet</h3>
          <p className="text-gray-500 mb-4">Generate AI-powered proposals to stand out</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Generate Your First Proposal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal._id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {proposal.job ? (
                    <h3 className="font-semibold text-gray-900 mb-1">{proposal.job.title}</h3>
                  ) : (
                    <h3 className="font-semibold text-gray-900 mb-1">{proposal.jobTitle}</h3>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{format(new Date(proposal.createdAt), 'MMM d, yyyy')}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${toneColors[proposal.tone]}`}>
                      {proposal.tone}
                    </span>
                    <span className="text-xs">{proposal.wordCount} words</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(proposal.content)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateMutation.mutate({ id: proposal._id, data: { isFavorite: !proposal.isFavorite } })}
                    className={`p-2 transition-colors ${proposal.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                    title="Favorite"
                  >
                    <Star className="w-4 h-4" fill={proposal.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(proposal._id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
                {proposal.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ProposalModal
          onClose={() => setShowModal(false)}
          onGenerate={generateMutation.mutate}
        />
      )}
    </div>
  );
}
