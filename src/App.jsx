import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import AppLayout from './components/layout/AppLayout'
import Landing from './pages/public/Landing'
import Auth from './pages/public/Auth'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import ForgotPassword from './pages/public/ForgotPassword'
import ResetPassword from './pages/public/ResetPassword'
import VerifyEmail from './pages/public/VerifyEmail'
import SetupSkills from './pages/jobseeker/SetupSkills'
import SeekerDashboard from './pages/jobseeker/Dashboard'
import JobFeed from './pages/jobseeker/JobFeed'
import Profile from './pages/jobseeker/Profile'
import Resume from './pages/jobseeker/Resume'
import Applications from './pages/jobseeker/Applications'
import Proposals from './pages/jobseeker/Proposals'
import PosterDashboard from './pages/jobposter/Dashboard'
import CreateJob from './pages/jobposter/CreateJob'
import MyJobs from './pages/jobposter/MyJobs'
import EditJob from './pages/jobposter/EditJob'
import Applicants from './pages/jobposter/Applicants'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminJobs from './pages/admin/Jobs'
import AdminEmails from './pages/admin/Emails'
import AdminWaitlist from './pages/admin/Waitlist'
import AdminActivity from './pages/admin/Activity'
import './index.css'

const queryClient = new QueryClient()

function PrivateRoute({ children, roles, requireSkills = true }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isEmailVerified) return <Navigate to="/verify-email" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  
  // Enforce mandatory skills setup for jobseekers
  if (requireSkills && user?.role === 'jobseeker' && (!user.skills || user.skills.length === 0)) {
    return <Navigate to="/setup-skills" replace />;
  }
  
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Job Seeker */}
          <Route path="/setup-skills" element={<PrivateRoute roles={['jobseeker']} requireSkills={false}><SetupSkills /></PrivateRoute>} />
          <Route path="/dashboard"    element={<PrivateRoute roles={['jobseeker']}><AppLayout><SeekerDashboard /></AppLayout></PrivateRoute>} />
          <Route path="/jobs"         element={<PrivateRoute roles={['jobseeker']}><AppLayout><JobFeed /></AppLayout></PrivateRoute>} />
          <Route path="/profile"      element={<PrivateRoute roles={['jobseeker']}><AppLayout><Profile /></AppLayout></PrivateRoute>} />
          <Route path="/resume"       element={<PrivateRoute roles={['jobseeker']}><AppLayout><Resume /></AppLayout></PrivateRoute>} />
          <Route path="/applications" element={<PrivateRoute roles={['jobseeker']}><AppLayout><Applications /></AppLayout></PrivateRoute>} />
          <Route path="/proposals"    element={<PrivateRoute roles={['jobseeker']}><AppLayout><Proposals /></AppLayout></PrivateRoute>} />

          {/* Job Poster */}
          <Route path="/poster/dashboard"         element={<PrivateRoute roles={['jobposter']}><AppLayout><PosterDashboard /></AppLayout></PrivateRoute>} />
          <Route path="/poster/create-job"        element={<PrivateRoute roles={['jobposter']}><AppLayout><CreateJob /></AppLayout></PrivateRoute>} />
          <Route path="/poster/my-jobs"           element={<PrivateRoute roles={['jobposter']}><AppLayout><MyJobs /></AppLayout></PrivateRoute>} />
          <Route path="/poster/edit-job/:jobId"   element={<PrivateRoute roles={['jobposter']}><AppLayout><EditJob /></AppLayout></PrivateRoute>} />
          <Route path="/poster/applicants/:jobId" element={<PrivateRoute roles={['jobposter']}><AppLayout><Applicants /></AppLayout></PrivateRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AppLayout><AdminDashboard /></AppLayout></PrivateRoute>} />
          <Route path="/admin/users"     element={<PrivateRoute roles={['admin']}><AppLayout><AdminUsers /></AppLayout></PrivateRoute>} />
          <Route path="/admin/jobs"      element={<PrivateRoute roles={['admin']}><AppLayout><AdminJobs /></AppLayout></PrivateRoute>} />
          <Route path="/admin/emails"    element={<PrivateRoute roles={['admin']}><AppLayout><AdminEmails /></AppLayout></PrivateRoute>} />
          <Route path="/admin/waitlist"  element={<PrivateRoute roles={['admin']}><AppLayout><AdminWaitlist /></AppLayout></PrivateRoute>} />
          <Route path="/admin/activity" element={<PrivateRoute roles={['admin']}><AppLayout><AdminActivity /></AppLayout></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}
