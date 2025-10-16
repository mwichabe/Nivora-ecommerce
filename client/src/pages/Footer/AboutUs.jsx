import React from 'react';
import { Award, Zap, Heart } from 'lucide-react';
import heroImage from '../../assets/botique_hero.png';
import founder1 from '../../assets/Collins.png';
//import founder2 from '../../assets/Keny.png';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        
        {/* --- Header & Brand Story Section --- */}
        <div className="text-center mb-16">
          <h1 className="text-sm font-semibold uppercase tracking-widest text-[#ea2e0e] mb-3">
            Our Legacy
          </h1>
          <h2 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            The Story Behind ONE MAN BOTIQUE
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Founded on the principle of accessible, high-quality style, we curate collections that embody modern sophistication and lasting value.
          </p>
        </div>

        {/* --- Feature Image Section --- */}
        <div className="relative mb-16">
          {/* ✅ YES, THIS IS WHERE YOU SHOULD INSERT A REAL IMAGE. ✅
             This image should ideally showcase your boutique, your products, 
             or the overall aesthetic of your brand. It's a key visual! */}
          <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-2xl">
            <img 
              src={heroImage} 
              alt="Boutique interior or curated collection showcasing brand aesthetic"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 p-4 bg-white bg-opacity-90 rounded-tl-xl shadow-lg">
             <p className="text-sm font-medium text-gray-700">Committed to Timeless Fashion.</p>
          </div>
        </div>
        
        {/* --- Mission, Vision, and Values --- */}
        <div className="bg-white rounded-xl shadow-xl p-10 mb-16 border-t-4 border-[#ea2e0e]">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Our Guiding Principles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="text-center p-4">
              <Zap className="w-10 h-10 text-[#ea2e0e] mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h4>
              <p className="text-gray-600">
                To provide men and women with expertly chosen apparel that blends comfort, durability, and contemporary trends without the high-end price tag.
              </p>
            </div>

            <div className="text-center p-4">
              <Award className="w-10 h-10 text-[#ea2e0e] mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Quality Commitment</h4>
              <p className="text-gray-600">
                We believe in ethical sourcing and meticulous craftsmanship. Every item is inspected to ensure it meets our strict standards for excellence and longevity.
              </p>
            </div>

            <div className="text-center p-4">
              <Heart className="w-10 h-10 text-[#ea2e0e] mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Customer Focus</h4>
              <p className="text-gray-600">
                Our customers are the heart of the boutique. We strive to provide personalized service and a seamless shopping experience from start to finish.
              </p>
            </div>
          </div>
        </div>

        {/* --- Meet the Founders (Updated for Two Founders) --- */}
        <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-10">
                Meet the Founders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Founder 1 */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col items-center p-6">
                    <img 
                        className="h-40 w-40 object-cover rounded-full mb-4 border-4 border-gray-100 shadow-md" 
                        src={founder1} 
                        alt="Founder 1 Profile Picture" 
                    />
                    <div className="text-center">
                        <div className="uppercase tracking-wide text-xs text-[#ea2e0e] font-semibold">Co-Founder & Visionary</div>
                        <p className="block mt-1 text-xl leading-tight font-medium text-black mb-2">Collins Mwichabe</p>
                        <p className="mt-2 text-gray-500 text-sm">
                            "My passion is to create a seamless bridge between timeless elegance and modern functionality, ensuring every piece empowers our customers."
                        </p>
                    </div>
                </div>

                {/* Founder 2 */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col items-center p-6">
                    <img 
                        className="h-40 w-40 object-cover rounded-full mb-4 border-4 border-gray-100 shadow-md" 
                        src={"founder2"} 
                        alt="Founder 2 Profile Picture" 
                    />
                    <div className="text-center">
                        <div className="uppercase tracking-wide text-xs text-[#ea2e0e] font-semibold">Co-Founder & Head of Operations</div>
                        <p className="block mt-1 text-xl leading-tight font-medium text-black mb-2">Keny Mateka</p>
                        <p className="mt-2 text-gray-500 text-sm">
                            "Bringing our vision to life requires meticulous attention to detail, from sourcing to delivery, ensuring every customer experience is exceptional."
                        </p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;