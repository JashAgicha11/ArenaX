import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Header from './Header'
import Footer from './Footer'
import Navigation from './Navigation'

const Layout = ({ children }) => {
  const layoutRef = useRef(null)

  useEffect(() => {
    // GSAP animations for layout
    const ctx = gsap.context(() => {
      // Fade in the layout
      gsap.fromTo(layoutRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )

      // Animate main content entrance
      gsap.fromTo('main', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
      )
    }, layoutRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={layoutRef} className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      <Navigation />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  )
}

export default Layout 