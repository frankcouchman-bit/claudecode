'use client'
import { useEffect, useState } from 'react'
import { API_BASE } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default function DebugPage() {
  const [token, setToken] = useState<string | null>(null)
  const [apiTest, setApiTest] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    setToken(getAccessToken())
  }, [])

  const testAPI = async () => {
    setTesting(true)
    setApiTest(null)

    const testUrl = `${API_BASE}/api/generate-draft`
    console.log('Testing API:', testUrl)

    try {
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(getAccessToken() ? { 'Authorization': `Bearer ${getAccessToken()}` } : {})
        },
        body: JSON.stringify({
          topic: 'test article',
          tone: 'professional',
          language: 'en',
          target_word_count: 1000
        })
      })

      console.log('Response status:', response.status)
      const text = await response.text()
      console.log('Response body:', text)

      try {
        const json = JSON.parse(text)
        setApiTest({
          status: response.status,
          ok: response.ok,
          data: json
        })
      } catch {
        setApiTest({
          status: response.status,
          ok: response.ok,
          data: text
        })
      }
    } catch (err: any) {
      console.error('API test error:', err)
      setApiTest({
        status: 'error',
        message: err.message
      })
    }
    setTesting(false)
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-4">Debug Info</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">API Base URL:</h2>
          <code className="bg-gray-100 p-2 rounded block">{API_BASE}</code>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Full API Endpoint:</h2>
          <code className="bg-gray-100 p-2 rounded block">{API_BASE}/api/generate-draft</code>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Access Token:</h2>
          <code className="bg-gray-100 p-2 rounded block break-all text-xs">
            {token ? `${token.substring(0, 100)}...` : 'None - You need to sign in first'}
          </code>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">API Test:</h2>
          <Button onClick={testAPI} disabled={testing} className="mb-4">
            {testing ? 'Testing...' : 'Test API Endpoint'}
          </Button>
          {apiTest && (
            <pre className="bg-gray-100 p-2 rounded overflow-auto text-xs">
              {JSON.stringify(apiTest, null, 2)}
            </pre>
          )}
        </div>

        <div className="p-4 border rounded bg-yellow-50">
          <h2 className="font-semibold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Check if you have an access token (sign in first if not)</li>
            <li>Click "Test API Endpoint" to test the backend</li>
            <li>Check browser console (F12) for detailed logs</li>
            <li>If you get "Not found", the backend endpoint may be wrong</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
