import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import AppLayout from './components/layout/AppLayout'
import Landing from './pages/public/Landing'
import Login from './pages/Login'
import Register from './pages/public/Register'
import SeekerDashboard from './pages/jobseeker/Dashboard'
import JobFeed from './pages/jobseeker/JobFeed'
import Profile from './pages/jobseeker/Profile'
import Resume from './pages/jobseeker/Resume'
import Applications from './pages/jobseeker/Applications'
import Proposals from './pages/jobseeker/Proposals'
import PosterDashboard from './pages/jobposter/Dashboard'
import CreateJob from './pages/jobposter/CreateJob'
import MyJobs from './pages/jobposter/MyJobs'
import Applicants from './pages/jobposter/Applicants'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminJobs from './pages/admin/Jobs'
import './index.css'

const queryClient = new QueryClient()

function PrivateRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<PrivateRoute roles={['jobseeker']}><AppLayout><SeekerDashboard /></AppLayout></PrivateRoute>} />
          <Route path="/jobs" element={<PrivateRoute roles={['jobseeker']}><AppLayout><JobFeed /></AppLayout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute roles={['jobseeker']}><AppLayout><Profile /></AppLayout></PrivateRoute>} />
          <Route path="/resume" element={<PrivateRoute roles={['jobseeker']}><AppLayout><Resume /></AppLayout></PrivateRoute>} />
          <Route path="/applications" element={<PrivateRoute roles={['jobseeker']}><AppLayout><Applications /></AppLayout></PrivateRoute>} />
          <Route path="/proposals" element={<PrivateRoute roles={['jobseeker']}><AppLayout><Proposals /></AppLayout></PrivateRoute>} />

          <Route path="/poster/dashboard" element={<PrivateRoute roles={['jobposter']}><AppLayout><PosterDashboard /></AppLayout></PrivateRoute>} />
          <Route path="/poster/create-job" element={<PrivateRoute roles={['jobposter']}><AppLayout><CreateJob /></AppLayout></PrivateRoute>} />
          <Route path="/poster/my-jobs" element={<PrivateRoute roles={['jobposter']}><AppLayout><MyJobs /></AppLayout></PrivateRoute>} />
          <Route path="/poster/applicants/:jobId" element={<PrivateRoute roles={['jobposter']}><AppLayout><Applicants /></AppLayout></PrivateRoute>} />

          <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AppLayout><AdminDashboard /></AppLayout></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><AppLayout><AdminUsers /></AppLayout></PrivateRoute>} />
          <Route path="/admin/jobs" element={<PrivateRoute roles={['admin']}><AppLayout><AdminJobs /></AppLayout></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}
