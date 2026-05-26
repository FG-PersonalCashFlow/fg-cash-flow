import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    const isMissingConfig = error.message.includes('projectId') || error.message.includes('API key') || error.message.includes('apiKey')

    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-lg w-full">
          <div className="text-2xl mb-3">⚠️</div>
          <h1 className="text-white font-semibold text-lg mb-2">
            {isMissingConfig ? 'Firebase not configured' : 'Something went wrong'}
          </h1>
          {isMissingConfig ? (
            <div className="text-gray-400 text-sm space-y-3">
              <p>The Firebase environment variables are missing. Add these secrets to your GitHub repo:</p>
              <pre className="bg-gray-800 rounded-lg p-3 text-xs text-gray-300 overflow-x-auto">{`VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID`}</pre>
              <p>Settings → Secrets and variables → Actions → New repository secret</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">{error.message}</p>
          )}
        </div>
      </div>
    )
  }
}
