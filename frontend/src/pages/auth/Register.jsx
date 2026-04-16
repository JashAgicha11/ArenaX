import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'

const roleOptions = [
  { value: 'fan', label: 'Fan' },
  { value: 'player', label: 'Player' },
  { value: 'organizer', label: 'Organizer' },
  { value: 'scorer', label: 'Scorer' },
]

const Register = () => {
  const { register, loading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'fan',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim().length >= 2 &&
      /\S+@\S+\.\S+/.test(formData.email.trim()) &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword
    )
  }, [formData])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const nextErrors = {}
    const nameValue = formData.name.trim()
    const emailValue = formData.email.trim()

    if (nameValue.length < 2) {
      nextErrors.name = 'Name must be at least 2 characters.'
    }

    if (!emailValue) {
      nextErrors.email = 'Email is required.'
    } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.'
    } else if (formData.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password.'
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm()) return

    await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
    })
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 top-6 h-72 w-72 rounded-full bg-primary-300/25 blur-3xl dark:bg-primary-500/20" />
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-violet-300/25 blur-3xl dark:bg-violet-500/20" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        <div className="grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 shadow-2xl shadow-slate-300/30 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/30 lg:grid-cols-[1.02fr_1fr]">
          <div className="hidden bg-gradient-to-br from-slate-900 via-primary-900 to-indigo-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/90">
                Join ArenaX
              </p>
              <h1 className="text-4xl font-semibold leading-tight">Create your account and start competing smarter</h1>
              <p className="mt-4 max-w-md text-slate-200">
                Discover matches, follow tournaments, and build your profile with a premium sports-first platform experience.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-slate-200/95">
              <li>Unified match insights</li>
              <li>Role-based dashboard access</li>
              <li>Live event and scoring workflow</li>
            </ul>
          </div>

          <div className="p-6 sm:p-10">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Create Account</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Build your profile in less than a minute.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary-400 dark:focus:ring-primary-500/20"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>

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
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="role">
                  Account role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-primary-400 dark:focus:ring-primary-500/20"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary-400 dark:focus:ring-primary-500/20"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="confirmPassword">
                    Confirm password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-sm font-medium text-primary-700 transition hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary-400 dark:focus:ring-primary-500/20"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary-500 dark:hover:bg-primary-400"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              Already registered?{' '}
              <Link className="font-semibold text-primary-700 hover:underline dark:text-primary-300" to="/login">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register