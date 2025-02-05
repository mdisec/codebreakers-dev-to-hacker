import RegisterForm from '../components/auth/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <RegisterForm />
      <p className="text-center mt-4 text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-500 hover:text-blue-600">
          Login here
        </Link>
      </p>
    </div>
  )
} 