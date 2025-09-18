"use client";
import Image from "next/image";
import Link from "next/link";

const cards = [
	{
		title: "Peer Support",
		img: "/images/peer-support.png",
		desc: "Connect with families who understand your journey.",
	},
	{
		title: "Counseling",
		img: "/images/counseling.png",
		desc: "Find trusted professionals for guidance and support.",
	},
	{
		title: "Learning Help",
		img: "/images/learning-help.png",
		desc: "Access resources for learning challenges and academic support.",
	},
	{
		title: "Conflict Resolution",
		img: "/images/conflict-resolution.png",
		desc: "Tools and referrals to help resolve family conflicts.",
	},
	{
		title: "Community Events",
		img: "/images/events.png",
		desc: "Join webinars, podcasts, and workshops for families.",
	},
	{
		title: "Wellness Activities",
		img: "/images/wellness.png",
		desc: "Explore mindfulness, relaxation, and self-care tools.",
	},
	{
		title: "Resource Library",
		img: "/images/resources.png",
		desc: "Download research and guides for your family’s needs.",
	},
	{
		title: "Rewards",
		img: "/images/rewards.png",
		desc: "Earn loyalty rewards for engaging with FamilyNation.",
	},
];

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-blue-100 flex flex-col">
			{/* Header */}


			{/* Hero */}
			<section className="max-w-4xl mx-auto text-center mt-12 mb-8 px-4">
				<h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 drop-shadow">
					Every Family’s Journey is Unique. <br className="hidden md:block" />
					Find Support That Fits Yours.
				</h1>
				<p className="text-lg md:text-xl text-gray-700 mb-6">
					FamilyNation offers evidence-based resources, real community, and expert
					guidance for families facing challenges—personalized for you.
				</p>
				<a
					href="#features"
					className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-xl hover:scale-105 hover:from-green-600 hover:to-blue-600 transition-all"
				>
					Explore Features
				</a>
			</section>

			{/* Features Grid */}
			<section id="features" className="max-w-6xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
					{cards.map((card) => (
						<div
							key={card.title}
							className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-6 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all group"
						>
							<div className="w-20 h-20 mb-4 flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-100 via-pink-100 to-purple-100 group-hover:from-blue-200 group-hover:to-pink-200 transition">
								<Image
									src={card.img}
									alt={card.title}
									width={80}
									height={80}
									className="rounded-xl object-cover"
								/>
							</div>
							<h3 className="text-xl font-bold text-blue-700 mb-2">
								{card.title}
							</h3>
							<p className="text-gray-600 text-center">{card.desc}</p>
						</div>
					))}
				</div>
			</section>

			{/* Call to Action */}
			<section id="get-started" className="max-w-4xl mx-auto text-center my-12 px-4">
				<h2 className="text-3xl font-extrabold text-purple-700 mb-4">
					Ready to Start?
				</h2>
				<p className="text-lg text-gray-700 mb-6">
					Join FamilyNation and connect with resources, professionals, and families
					who care.
				</p>
				<Link
					href="/chat"
					className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-xl hover:scale-105 hover:from-pink-600 hover:to-purple-600 transition-all"
				>
					Get Started Now
				</Link>
			</section>

			{/* Footer */}
			<footer className="bg-white/90 shadow mt-auto py-4 text-center text-gray-500 text-sm z-10">
				&copy; {new Date().getFullYear()} FamilyNation. All rights reserved.
			</footer>
		</div>
	);
}