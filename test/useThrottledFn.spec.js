import React from 'react'
import { cleanup as cleanupHooks, renderHook } from '@testing-library/react-hooks'
import { cleanup as cleanupReact, render } from '@testing-library/react'
import useThrottledFn from '../dist/useThrottledFn'
import promiseDelay from './utils/promiseDelay'


describe('useThrottledFn', () => {
  beforeEach(() => {
    cleanupReact()
    cleanupHooks()
  })

  afterEach(sinon.restore)

  it('should be a function', () => {
    expect(useThrottledFn).to.be.a('function')
  })

  it('should return a single function', () => {
    const fn = () => 0
    const { result } = renderHook(() => useThrottledFn(fn))

    expect(result.current).to.be.a('function')
  })

  it('should return a throttled function', async () => {
    const spy = sinon.spy()

    const TestComponent = () => {
      const throttledFn = useThrottledFn(() => {
        spy()
      }, 250)

      React.useEffect(() => {
        throttledFn()
        throttledFn()
        throttledFn()
        throttledFn()
      }, [])

      return <div />
    }

    render(<TestComponent />)

    await promiseDelay(250)

    expect(spy.called).to.be.true
    expect(spy.callCount).to.equal(1)
  })
})
