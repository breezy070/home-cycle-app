// client/src/test/App.routes.test.jsx
import { describe, test, expect } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render, waitFor } from '@testing-library/react' // <-- waitFor here
import App from '@/App'

// Minimal user slice so App & PrivateRoute can mount
function userReducer(state = { currentUser: null }, action) { return state }

function renderAt(route = '/') {
  const store = configureStore({ reducer: { user: userReducer } })
  // push the test URL BEFORE rendering, because App contains <BrowserRouter />
  window.history.pushState({}, '', route)
  return render(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

describe('App routing', () => {
  it('should renders home on / (no redirect)', async () => {
    renderAt('/')
    expect(window.location.pathname).toBe('/')
  })

  it('should unauthenticated user hitting /profile is redirected', async () => {
    renderAt('/profile')
    await waitFor(() => {
      expect(['/sign-in', '/unauthorized']).toContain(window.location.pathname)
    })
  })
})
