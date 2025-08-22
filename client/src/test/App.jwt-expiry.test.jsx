import { describe, test, expect, vi } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render, waitFor } from '@testing-library/react'
import App from '@/App'

// Mock jwt-decode to return an already-expired token
vi.mock('jwt-decode', () => {
  const past = Math.floor(Date.now() / 1000) - 10
  return { jwtDecode: () => ({ exp: past }) }
})

// Reducer that handles logoutSuccess by clearing currentUser
function userReducer(state = { currentUser: { role: 'user' } }, action) {
  if (action.type === 'user/logoutSuccess') {
    return { ...state, currentUser: null }
  }
  return state
}

describe('JWT expiry effect', () => {
  test('expired cookie triggers logout and clears localStorage', async () => {
    // Ensure the effect runs: cookie present and localStorage has a token
    document.cookie = 'access_token=fake.jwt.value'
    localStorage.setItem('access_token', 'whatever')

    const store = configureStore({ reducer: { user: userReducer } })
    window.history.pushState({}, '', '/')
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    // assert logout happened (Redux)
    await waitFor(() => {
      expect(store.getState().user.currentUser).toBeNull()
    })
    // assert side-effect on localStorage
    expect(localStorage.getItem('access_token')).toBeNull()
  })
})
