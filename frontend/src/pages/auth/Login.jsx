import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'

const Login = () => {
  const { login, loading } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const isFormValid = useMemo(() => {
    return formData.email.trim().length > 0 && formData.password.length >= 6
  }, [formData.email, formData.password])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const nextErrors = {}
    const emailValue = formData.email.trim()

    if (!emailValue) {
      nextErrors.email = 'Email is required.'
    } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm()) return

    await login(formData.email.trim(), formData.password)
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-primary-300/30 blur-3xl dark:bg-primary-500/20" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-500/20" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        <div className="grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-2xl shadow-slate-300/30 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/30 lg:grid-cols-[1.08fr_1fr]">
          <div className="hidden bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/90">
                Welcome Back
              </p>
              <h1 className="text-4xl font-semibold leading-tight">
                Sign in and continue your game journey
              </h1>
              <p className="mt-4 max-w-md text-primary-100">
                Track matches, manage your teams, and stay on top of tournaments with a cleaner and faster ArenaX experience.
              </p>
            </div>
            <p className="text-sm text-primary-100/90">ArenaX - Sport, data, and community in one platform.</p>
          </div>

          <div className="p-6 sm:p-10">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Login</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Access your account securely and pick up where you left off.
            </p>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary-400 dark:focus:ring-primary-500/20"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-sm font-medium text-primary-700 transition hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary-400 dark:focus:ring-primary-500/20"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary-500 dark:hover:bg-primary-400"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              New to ArenaX?{' '}
              <Link className="font-semibold text-primary-700 hover:underline dark:text-primary-300" to="/register">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login