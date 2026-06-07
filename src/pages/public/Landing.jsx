import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import WaitlistModal from '../../components/waitlist/WaitlistModal';

export default function Landing() {

  const [scrolled, setScrolled] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  console.log('Landing component rendered');
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-[#0f0a1e] to-[#1a0533] text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 
  backdrop-blur-xl transition-all duration-300
  ${scrolled
            ? "bg-[#0f0a1e]/80 shadow-lg shadow-black/30 py-3"
            : "bg-[#0f0a1e]/40 py-5"
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-900/50">
              <Zap className="h-5 w-5 text-white" />
            </div>

            <Link
              to="/">
              <h1 className="text-lg font-bold text-white">
                FreelanceRadar
              </h1>

              <p className="text-xs text-gray-400">
                Built by Manvendra
              </p>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/50 transition-all duration-200 hover:scale-[1.02] hover:from-violet-500 hover:to-purple-500 active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-[170px] pb-20">
        <div className="pointer-events-none absolute left-1/2 top-20 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Real-time Reddit Aggregation
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
            All <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Reddit Freelance</span> Jobs, In One Place
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300 md:text-xl">
            Stop scrolling through endless subreddits. We aggregate, categorize, and match high-quality freelance opportunities from Reddit directly to your skills.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-violet-900/50 transition-all duration-200 hover:scale-[1.03] hover:from-violet-500 hover:to-purple-500 active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-violet-500" />
              AI Job Matching
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-violet-500" />
              50+ Real Users Signed Up
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-violet-500" />
              Automatic Categorization
            </div>
          </div>
        </div>

        {/* Realistic Mockup UI */}
        <div className="mx-auto mt-20 max-w-4xl relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-violet-600/30 to-transparent blur-xl opacity-50" />
          <div className="relative rounded-3xl border border-white/10 bg-[#140d26]/80 p-6 shadow-2xl backdrop-blur-2xl">

            {/* Mockup Header */}
            <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Recommended for you</h3>
                <p className="text-sm text-gray-400">Based on your skills: React, Node.js, Tailwind</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm font-medium text-gray-300 border border-white/5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                98% Match accuracy
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {/* Job 1 */}
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-colors cursor-default">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="rounded-md bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400 border border-green-500/20">
                        r/forhire
                      </span>
                      <span className="text-xs text-gray-400">2 hours ago</span>
                    </div>
                    <h4 className="text-lg font-semibold text-white">[Hiring] Full Stack Next.js & Node Developer for MVP</h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-lg font-bold text-violet-300">$40 - $60 / hr</div>
                    <div className="text-sm text-gray-400">Estimated 20-30 hrs/wk</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-6 line-clamp-2">
                  We are looking for an experienced full-stack developer to help build out the MVP of our new SaaS platform. Must have strong experience with React, Next.js, Node.js, and PostgreSQL. Familiarity with Tailwind CSS is a huge plus.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 border border-white/10">React</span>
                  <span className="rounded-lg bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 border border-white/10">Node.js</span>
                  <span className="rounded-lg bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 border border-white/10">Next.js</span>
                  <span className="rounded-lg bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-300 border border-violet-500/20">Tailwind</span>
                </div>
              </div>

              {/* Job 2 */}
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-colors cursor-default">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="rounded-md bg-orange-500/20 px-2 py-1 text-xs font-medium text-orange-400 border border-orange-500/20">
                        r/freelance_forhire
                      </span>
                      <span className="text-xs text-gray-400">5 hours ago</span>
                    </div>
                    <h4 className="text-lg font-semibold text-white">[Hiring] Frontend React Developer to revamp our dashboard</h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-lg font-bold text-violet-300">$1,500 fixed</div>
                    <div className="text-sm text-gray-400">One-time project</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-6 line-clamp-2">
                  Seeking a frontend specialist to redesign and implement a new UI for our analytics dashboard. We have the Figma files ready. You will be responsible for bringing them to life using React and Tailwind.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 border border-white/10">React</span>
                  <span className="rounded-lg bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-300 border border-violet-500/20">Tailwind CSS</span>
                  <span className="rounded-lg bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 border border-white/10">Figma</span>
                </div>
              </div>
            </div>

            {/* Fade out bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#140d26] to-transparent rounded-b-3xl pointer-events-none" />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-32 relative z-10 text-center">
          <h2 className="text-4xl font-black text-white mb-12">Start Free. Get Alerts When It Matters.</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            {/* Free Plan */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur-xl flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">$0.00</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "All Reddit freelance jobs in one feed",
                  "Skill-based job matching",
                  "Category filters and search",
                  "Daily email digest",
                  "Save and track jobs"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-violet-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="w-full block py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-center transition-colors border border-white/10"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="rounded-3xl border border-violet-500/50 bg-[#140d26]/80 p-8 shadow-[0_0_30px_rgba(124,58,237,0.2)] backdrop-blur-xl relative flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">$3.99</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Everything in Free",
                  "Instant email alerts when matching job is posted",
                  "Priority job feed (newest first, no delay)",
                  "AI job quality score",
                  "Resume-based auto skill detection"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-violet-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowWaitlist(true)}
                className="w-full py-3 rounded-xl border border-[#2d1f4e] bg-transparent text-white font-semibold text-center hover:bg-[#7c3aed]/5 transition-colors"
              >
                Join Waitlist
              </button>
              <WaitlistModal open={showWaitlist} onClose={() => setShowWaitlist(false)} />
            </div>
          </div>
        </div>

        <div className="relative mt-28 overflow-hidden rounded-[32px] bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-16 text-center shadow-2xl shadow-violet-200">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white">
              Ready to Get Started?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-violet-100">
              Start your freelance journey with FreelanceRadar.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-violet-700 shadow-xl transition-all duration-200 hover:scale-[1.03] hover:bg-violet-50 active:scale-[0.98]"
            >
              Create Your Free Account
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
