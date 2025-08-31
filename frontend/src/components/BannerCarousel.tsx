import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import { useEffect, useRef, useState } from 'react'

const bannerData = [
	{
		id: 1,
		image: 'https://picsum.photos/seed/banner1/1200/600',
		title: 'Selamat Datang di SDN Petir 3',
		subtitle: 'Membangun Generasi Unggul Berakhlak Mulia',
		description:
			'Sekolah Dasar Negeri yang berkomitmen memberikan pendidikan berkualitas dengan lingkungan belajar yang aman, nyaman, dan menyenangkan.',
	},
	{
		id: 2,
		image: 'https://picsum.photos/seed/banner2/1200/600',
		title: 'Fasilitas Lengkap untuk Belajar',
		subtitle: 'Ruang Kelas Modern & Perpustakaan',
		description:
			'Dilengkapi dengan fasilitas pembelajaran yang modern untuk mendukung proses belajar mengajar yang efektif dan menyenangkan.',
	},
	{
		id: 3,
		image: 'https://picsum.photos/seed/banner3/1200/600',
		title: 'Tenaga Pendidik Berkualitas',
		subtitle: 'Guru Profesional & Berpengalaman',
		description:
			'Didukung oleh tenaga pendidik yang profesional, berpengalaman, dan selalu siap memberikan yang terbaik untuk siswa-siswi kami.',
	},
]

export default function BannerCarousel() {
	const [isAutoScrolling, setIsAutoScrolling] = useState(false)
	const autoScrollRef = useRef<number | null>(null)

	const settings = {
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

	const startAutoScroll = () => {
		if (isAutoScrolling) return

		setIsAutoScrolling(true)

		const scrollStep = () => {
			if (
				window.scrollY + window.innerHeight >=
				document.documentElement.scrollHeight
			) {
				// Reached bottom, stop auto scroll
				setIsAutoScrolling(false)
				return
			}

			window.scrollBy(0, 2) // Scroll speed (pixels per frame)
			autoScrollRef.current = requestAnimationFrame(scrollStep)
		}

		autoScrollRef.current = requestAnimationFrame(scrollStep)
	}

	const stopAutoScroll = () => {
		if (autoScrollRef.current) {
			cancelAnimationFrame(autoScrollRef.current)
			autoScrollRef.current = null
		}
		setIsAutoScrolling(false)
	}

	useEffect(() => {
		const handleScroll = () => {
			// Stop auto scroll when user manually scrolls
			if (isAutoScrolling) {
				stopAutoScroll()
			}
		}

		const handleWheel = () => {
			if (isAutoScrolling) {
				stopAutoScroll()
			}
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			// Stop auto scroll on arrow keys, page up/down, space, etc.
			if (
				[
					'ArrowUp',
					'ArrowDown',
					'PageUp',
					'PageDown',
					'Space',
					'Home',
					'End',
				].includes(e.code)
			) {
				if (isAutoScrolling) {
					stopAutoScroll()
				}
			}
		}

		window.addEventListener('scroll', handleScroll, { passive: true })
		window.addEventListener('wheel', handleWheel, { passive: true })
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('scroll', handleScroll)
			window.removeEventListener('wheel', handleWheel)
			window.removeEventListener('keydown', handleKeyDown)
			if (autoScrollRef.current) {
				cancelAnimationFrame(autoScrollRef.current)
			}
		}
	}, [isAutoScrolling])

	return (
		<div className="relative banner-carousel">
			<Slider {...settings}>
				{bannerData.map((slide) => (
					<div key={slide.id} className="relative">
						<div className="relative h-96 md:h-[600px] overflow-hidden rounded-2xl">
							{/* Background Image */}
							<img
								src={slide.image}
								alt={slide.title}
								className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
							/>

							{/* Gradient Overlay */}
							<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>

							{/* Additional Shadow Overlay */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

							{/* Content Container */}
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="container mx-auto px-4">
									<div className="max-w-4xl mx-auto text-center text-white">
										{/* Animated Content */}
										<div className="animate-slide-up">
											<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-shadow-strong">
												<span className="inline-block animate-fade-in-up animation-delay-100">
													{slide.title}
												</span>
											</h1>

											<h2 className="text-xl md:text-3xl lg:text-4xl mb-6 text-blue-200 font-semibold text-shadow-medium animate-fade-in-up animation-delay-200">
												{slide.subtitle}
											</h2>

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
												>
													{isAutoScrolling ? (
														<>
															<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
															Sedang Menjelajah...
														</>
													) : (
														<>
															<span>Jelajahi Sekolah Kami</span>
															<span className="animate-bounce">
																↓
															</span>
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