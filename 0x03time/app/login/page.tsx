import LoginForm from '../components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <LoginForm />
      <p className="text-center mt-4 text-gray-600">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-500 hover:text-blue-600">
          Register here
        </Link>
      </p>
    </div>
  )
} 