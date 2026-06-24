export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('reveal', {
        getSSRProps(binding) {
            // Provide initial classes for Server-Side Rendering
            const baseClass = 'transition-all duration-1000 ease-out opacity-0'
            const transformClass = binding.value || 'translate-y-16'
            return {
                class: `${baseClass} ${transformClass}`
            }
        },
        mounted(el, binding) {
            if (typeof window !== 'undefined') {
                const baseClass = 'transition-all duration-1000 ease-out opacity-0'
                const transformClass = binding.value || 'translate-y-16'
                
                // Add initial hidden classes (in case SSR didn't apply them or we're in SPA mode)
                el.classList.add(...baseClass.split(' '), ...transformClass.split(' '))
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // When visible, remove hidden classes and add fully visible classes
                            el.classList.remove('opacity-0', ...transformClass.split(' '))
                            el.classList.add('opacity-100', 'translate-y-0', 'translate-x-0', 'scale-100')
                            
                            // Stop observing once revealed (run once)
                            observer.unobserve(el)
                        }
                    })
                }, {
                    threshold: 0.15, // Trigger when 15% of the element is visible
                    rootMargin: '0px 0px -50px 0px'
                })
                
                observer.observe(el)
            }
        }
    })
})
