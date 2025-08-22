import { describe, test, expect } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render, waitFor } from '@testing-library/react'
import App from '@/App'

// Reducer that just returns given state
const userReducer = (state = { currentUser: null }, action) => state

function renderWithUser(user, startPath) {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: { currentUser: user } },
  })
  window.history.pushState({}, '', startPath)
  return render(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

describe('Admin-only routes', () => {
  test('admin can access /gestion-interventions', async () => {
    renderWithUser({ role: 'admin' }, '/gestion-interventions')
    await waitFor(() => {
      expect(window.location.pathname).toBe('/gestion-interventions')
    })
  })

  test('regular user is redirected away from /gestion-interventions', async () => {
    renderWithUser({ role: 'user' }, '/gestion-interventions')
    await waitFor(() => {
      // Depending on your PrivateRoute, redirect could be /unauthorized or /sign-in
      expect(['/unauthorized', '/sign-in']).toContain(window.location.pathname)
    })
  })
})
