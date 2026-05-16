import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BottomNav } from '@/components/layout/BottomNav'

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)
}

describe('BottomNav', () => {
  it('should render 5 nav items', () => {
    renderWithRouter(<BottomNav />)

    expect(screen.getByText('สะพาน')).toBeInTheDocument()
    expect(screen.getByText('รายงาน')).toBeInTheDocument()
    expect(screen.getByText('ปัญหา')).toBeInTheDocument()
    expect(screen.getByText('วัสดุ')).toBeInTheDocument()
    expect(screen.getByText('อื่นๆ')).toBeInTheDocument()
  })

  it('should have links to correct paths', () => {
    renderWithRouter(<BottomNav />)

    const links = screen.getAllByRole('link')
    const hrefs = links.map(l => l.getAttribute('href'))

    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/report')
    expect(hrefs).toContain('/problems')
    expect(hrefs).toContain('/materials')
    expect(hrefs).toContain('/more')
  })
})
