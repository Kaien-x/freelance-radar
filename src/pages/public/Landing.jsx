import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Briefcase, Users, TrendingUp } from 'lucide-react';

export default function Landing() {
  console.log('Landing component rendered');
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">FreelanceRadar</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-gray-600 hover:text-gray-900">Sign in</Link>
          <Link to="/register" className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Next <span className="text-violet-600">Freelance</span> Job
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered matching that connects talented freelancers with the perfect opportunities
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
              Start Hiring <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register" className="border border-violet-600 text-violet-600 hover:bg-violet-50 px-6 py-3 rounded-lg font-medium transition-colors">
              Find Work
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Briefcase,
              title: "For Job Seekers",
              description: "Discover opportunities matched to your skills with AI-powered recommendations",
              features: ["Smart job matching", "AI proposal generator", "Application tracking"]
            },
            {
              icon: Users,
              title: "For Job Posters",
              description: "Find the perfect talent for your projects with intelligent matching",
              features: ["Talent discovery", "Applicant management", "Easy job posting"]
            },
            {
              icon: TrendingUp,
              title: "AI-Powered",
              description: "Advanced algorithms match skills to requirements for perfect fits",
              features: ["Skill analysis", "Job recommendations", "Proposal assistance"]
            }
          ].map(({ icon: Icon, title, description, features }, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600 mb-6">{description}</p>
              <ul className="space-y-2">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-violet-600 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">Join thousands of freelancers and companies already using FreelanceRadar</p>
          <Link to="/register" className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg">
            Create Your Free Account
          </Link>
        </div>
      </main>
    </div>
  );
}
