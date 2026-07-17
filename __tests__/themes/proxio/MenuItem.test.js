import { fireEvent, render, screen } from '@testing-library/react'
import { MenuItem } from '@/themes/proxio/components/MenuItem'

const pushMock = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: pushMock
  })
}))

jest.mock('@/components/SmartLink', () => {
  return ({ href, children, ...props }) => (
    <a href={typeof href === 'string' ? href : href?.pathname} {...props}>
      {children}
    </a>
  )
})

describe('proxio MenuItem', () => {
  beforeEach(() => {
    pushMock.mockClear()
  })

  it('uses router.push for internal links', () => {
    render(<MenuItem link={{ name: '關於', href: '/about' }} />)

    const link = screen.getByRole('link', { name: '關於' })
    fireEvent.click(link)

    expect(pushMock).toHaveBeenCalledWith('/about')
  })

  it('does not hijack external links', () => {
    render(
      <MenuItem
        link={{ name: '外部連結', href: 'https://example.com', target: '_blank' }}
      />
    )

    const link = screen.getByRole('link', { name: '外部連結' })
    fireEvent.click(link)

    expect(pushMock).not.toHaveBeenCalled()
  })
})
