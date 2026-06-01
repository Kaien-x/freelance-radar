import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export default function Landing() {
  console.log('Landing component rendered');
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-200">
              <Zap className="h-5 w-5 text-white" />
            </div>

            <Link
              to="/">
              <h1 className="text-lg font-bold text-gray-900">
                FreelanceRadar
              </h1>

              <p className="text-xs text-gray-500">
                Built by Manvendra
              </p>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
            >
              Sign In
            </Link>

            <Link
              to="/auth"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-200 hover:scale-[1.02] hover:from-violet-700 hover:to-purple-700 active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto max-w-7xl px-6 pb-20 pt-24">
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Built for Freelancers
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight text-gray-900 md:text-7xl">
            Find Your Next{" "}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Freelance
            </span>{" "}
            Job
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
            Connect with top companies, discover high-quality projects,
            and let AI match you with opportunities that fit your skills perfectly.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/auth"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-violet-200 transition-all duration-200 hover:scale-[1.03] hover:from-violet-700 hover:to-purple-700 active:scale-[0.98]"
            >
              Find Work
              <ArrowRight className="h-5 w-5" />
            </Link>

            {/* <Link
              to="/register"
              className="rounded-2xl border border-violet-200 bg-white/80 px-8 py-4 text-lg font-semibold text-violet-700 backdrop-blur transition-all duration-200 hover:border-violet-300 hover:bg-violet-50"
            >
              Find Work
            </Link> */}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-violet-600" />
              AI Job Matching
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-violet-600" />
              Trusted Freelancers
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-violet-600" />
              Secure Payments
            </div>
          </div>
        </div>

        <div className="mt-28 grid justify-center gap-8 md:grid-cols-2">
          {[
            {
              icon: Briefcase,
              title: "For Job Seekers",
              description:
                "Discover opportunities perfectly matched to your skills using smart AI recommendations.",
              features: [
                "Smart job matching",
                "AI proposal generator",
                "Application tracking",
              ],
            },
            // {
            //   icon: Users,
            //   title: "For Job Posters",
            //   description:
            //     "Find highly qualified freelancers quickly with intelligent talent discovery tools.",
            //   features: [
            //     "Talent discovery",
            //     "Applicant management",
            //     "Easy job posting",
            //   ],
            // },
            {
              icon: TrendingUp,
              title: "AI-Powered",
              description:
                "Advanced algorithms analyze skills and project requirements for accurate matches.",
              features: [
                "Skill analysis",
                "Job recommendations",
                "Proposal assistance",
              ],
            },
          ].map(({ icon: Icon, title, description, features }, index) => (
            <div
              key={index}
              className="group rounded-3xl border border-white/50 bg-white/70 p-8 shadow-lg shadow-gray-100 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-100"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-7 w-7 text-violet-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900">
                {title}
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                {description}
              </p>

              <ul className="mt-6 space-y-3">
                {features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm font-medium text-gray-700"
                  >
                    <div className="h-2 w-2 rounded-full bg-violet-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
              to="/auth"
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
