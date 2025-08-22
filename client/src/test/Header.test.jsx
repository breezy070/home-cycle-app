import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Header from '@/components/Header'

function userReducer(state = { currentUser: null }, action) { return state }

function renderWithProviders(ui) {
  const store = configureStore({ reducer: { user: userReducer } })
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  )
}

test('Header renders navigation links', () => {
  renderWithProviders(<Header />)
  // Allow multiple matches – we only need at least one "Home" and "About" link
  const homeLinks = screen.getAllByRole('link', { name: /home/i })
  const aboutLinks = screen.getAllByRole('link', { name: /about/i })
  expect(homeLinks.length).toBeGreaterThan(0)
  expect(aboutLinks.length).toBeGreaterThan(0)
})
