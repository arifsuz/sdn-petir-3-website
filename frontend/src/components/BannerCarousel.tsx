import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import { useEffect, useRef, useState, useCallback } from 'react'

const bannerData = [
	{
		id: 1,
		image: '/Foto-Sekolah.jpeg',
		title: 'Selamat Datang di SDN Petir 3',
		subtitle: 'Membangun Generasi Unggul Berakhlak Mulia',
		description:
			'Sekolah Dasar Negeri yang berkomitmen memberikan pendidikan berkualitas dengan lingkungan belajar yang aman, nyaman, dan menyenangkan.',
	},
	{
		id: 2,
		image: '/Ruang Inklusi.jpeg',
		title: 'Fasilitas Lengkap untuk Belajar',
		subtitle: 'Ruang Kelas Modern & Perpustakaan',
		description:
			'Dilengkapi dengan fasilitas pembelajaran yang modern untuk mendukung proses belajar mengajar yang efektif dan menyenangkan.',
	},
	{
		id: 3,
		image: '/Tenaga-Pengajar.JPG',
		title: 'Tenaga Pendidik Berkualitas',
		subtitle: 'Guru Profesional & Berpengalaman',
		description:
			'Didukung oleh tenaga pendidik yang profesional, berpengalaman, dan selalu siap memberikan yang terbaik untuk siswa-siswi kami.',
	},
]

const SCROLL_SPEED = 2
const SCROLL_INTERVAL = 16 // ~60fps

export default function BannerCarousel() {
	const [isAutoScrolling, setIsAutoScrolling] = useState(false)
	const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const startTimeRef = useRef<number>(0)

	const sliderSettings = {
		dots: true,
		infinite: true,
		speed: 800,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		pauseOnHover: true,
		fade: true,
		cssEase: 'ease-in-out',
	}

	const stopAutoScroll = useCallback(() => {
		if (autoScrollIntervalRef.current) {
			clearInterval(autoScrollIntervalRef.current)
			autoScrollIntervalRef.current = null
		}
		setIsAutoScrolling(false)
	}, [])

	const startAutoScroll = useCallback(() => {
		if (isAutoScrolling) return

		setIsAutoScrolling(true)
		startTimeRef.current = Date.now()

		// Smooth scroll implementation using setInterval
		const scroll = () => {
			const currentScrollY =
				window.pageYOffset || document.documentElement.scrollTop
			const documentHeight = document.documentElement.scrollHeight
			const windowHeight = window.innerHeight

			// Check if reached bottom
			if (currentScrollY + windowHeight >= documentHeight - 10) {
				stopAutoScroll()
				return
			}

			// Smooth scroll
			window.scrollBy({
				top: SCROLL_SPEED,
				behavior: 'auto',
			})
		}

		autoScrollIntervalRef.current = setInterval(scroll, SCROLL_INTERVAL)
	}, [isAutoScrolling, stopAutoScroll])

	// Handle user interactions that should stop auto scroll
	useEffect(() => {
		const handleUserInteraction = () => {
			if (isAutoScrolling) {
				stopAutoScroll()
			}
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			const scrollKeys = [
				'ArrowUp',
				'ArrowDown',
				'PageUp',
				'PageDown',
				'Space',
				'Home',
				'End',
			]

			if (scrollKeys.includes(e.code) && isAutoScrolling) {
				stopAutoScroll()
			}
		}

		// Add event listeners
		window.addEventListener('wheel', handleUserInteraction, { passive: true })
		window.addEventListener('touchstart', handleUserInteraction, {
			passive: true,
		})
		window.addEventListener('keydown', handleKeyDown)

		// Listen for manual scroll
		let scrollTimeout: NodeJS.Timeout
		const handleScroll = () => {
			if (!isAutoScrolling) return

			clearTimeout(scrollTimeout)
			scrollTimeout = setTimeout(() => {
				// If auto scroll was started recently, don't stop it for manual scroll events
				if (Date.now() - startTimeRef.current > 100) {
					stopAutoScroll()
				}
			}, 50)
		}

		window.addEventListener('scroll', handleScroll, { passive: true })

		return () => {
			window.removeEventListener('wheel', handleUserInteraction)
			window.removeEventListener('touchstart', handleUserInteraction)
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('scroll', handleScroll)
			clearTimeout(scrollTimeout)
		}
	}, [isAutoScrolling, stopAutoScroll])

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (autoScrollIntervalRef.current) {
				clearInterval(autoScrollIntervalRef.current)
			}
		}
	}, [])

	return (
		<div className="relative banner-carousel">
			<Slider {...sliderSettings}>
				{bannerData.map((slide) => (
					<div key={slide.id} className="relative">
						<div className="relative h-96 md:h-[600px] overflow-hidden rounded-2xl">
							{/* Background Image */}
							<img
								src={slide.image}
								alt={slide.title}
								className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
								loading="lazy"
							/>

							{/* Gradient Overlay */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

							{/* Content Container */}
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="container mx-auto px-4">
									<div className="max-w-4xl mx-auto text-center text-white">
										<div className="animate-slide-up">
											{/* Title */}
											<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-shadow-strong text-blue-100">
												<span className="inline-block animate-fade-in-up animation-delay-100">
													{slide.title}
												</span>
											</h1>

											{/* Subtitle */}
											<h2 className="text-xl md:text-3xl lg:text-4xl mb-6 text-blue-200 font-semibold text-shadow-medium animate-fade-in-up animation-delay-200">
												{slide.subtitle}
											</h2>

											{/* Description */}
											<div className="max-w-3xl mx-auto">
												<p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-shadow-medium animate-fade-in-up animation-delay-300">
													{slide.description}
												</p>
											</div>

											{/* CTA Button */}
											<div className="mt-8 animate-fade-in-up animation-delay-400">
												<button
													onClick={startAutoScroll}
													disabled={isAutoScrolling}
													className={`${
														isAutoScrolling
															? 'bg-gray-500 cursor-not-allowed'
															: 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
													} text-white font-semibold py-4 px-8 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto`}
													aria-label={isAutoScrolling ? 'Sedang melakukan auto scroll' : 'Mulai auto scroll'}
												>
													{isAutoScrolling ? (
														<>
															<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
															<span>Sedang Menjelajah...</span>
														</>
													) : (
														<>
															<span>Jelajahi Sekolah Kami</span>
															<span className="animate-bounce">↓</span>
														</>
													)}
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</Slider>
		</div>
	)
}