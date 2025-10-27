'use client'
import { useEffect, useState } from 'react'
import { API_BASE } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'

export default function DebugPage() {
  const [token, setToken] = useState<string | null>(null)
  const [apiTest, setApiTest] = useState<any>(null)

  useEffect(() => {
    setToken(getAccessToken())

    // Test the API endpoint
    fetch(`${API_BASE}/api/generate-draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getAccessToken() ? { 'Authorization': `Bearer ${getAccessToken()}` } : {})
      },
      body: JSON.stringify({ topic: 'test' })
    })
    .then(res => res.text())
    .then(text => {
      try {
        setApiTest({ status: 'ok', data: JSON.parse(text) })
      } catch {
        setApiTest({ status: 'ok', data: text })
      }
    })
    .catch(err => setApiTest({ status: 'error', message: err.message }))
  }, [])

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-4">Debug Info</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">API Base URL:</h2>
          <code className="bg-gray-100 p-2 rounded block">{API_BASE}</code>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Access Token:</h2>
          <code className="bg-gray-100 p-2 rounded block break-all">
            {token ? token.substring(0, 50) + '...' : 'None'}
          </code>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">API Test Result:</h2>
          <pre className="bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(apiTest, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
