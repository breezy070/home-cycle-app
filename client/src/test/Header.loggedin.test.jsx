import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Header from '@/components/Header'

// Minimal user slice; just returns state
function userReducer(state = { currentUser: { role: 'user', profilePicture: 'x.png' } }, action) {
  return state
}

function renderWithProviders(ui) {
  const store = configureStore({
    reducer: { user: userReducer },
  })
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  )
}

test('Header (logged in) hides "Sign in" and shows nav', () => {
  renderWithProviders(<Header />)
  // Nav links exist
  const homeLinks = screen.getAllByRole('link', { name: /home/i })
  const aboutLinks = screen.getAllByRole('link', { name: /about/i })
  expect(homeLinks.length).toBeGreaterThan(0)
  expect(aboutLinks.length).toBeGreaterThan(0)

  // "Sign in" should NOT be visible when currentUser exists
  const signIn = screen.queryByRole('link', { name: /sign in/i })
  expect(signIn).toBeNull()
})
