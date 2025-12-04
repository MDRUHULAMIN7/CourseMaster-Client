'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Award, Play, ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden ">
      {/* Animated */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-linear-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div
          className="absolute w-96 h-96 bg-linear-to-r from-emerald-400/20 to-purple-400/50 rounded-full blur-3xl"
          style={{
            bottom: '10%',
            right: '10%',
            transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div
          className="absolute w-72 h-72 bg-linear-to-r from-orange-400/20 to-amber-400/20 rounded-full blur-3xl"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
      </div>
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-linear(circle, #000 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-full text-sm font-medium text-purple-400 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 50,000+ learners worldwide</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
              Transform Your
              <br />
              <span className="bg-linear-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                Career Journey
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              Master in-demand skills with expert-led courses. Learn at your own pace, earn certificates, and unlock new opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 transform"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Active Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Expert Courses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">4.9/5</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Right Column  */}
          <div className="relative animate-fade-in-up-delay">
            <div className="grid gap-6">
              {/* Card 1 */}
              <div className="group relative p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start gap-4">
                  <div className="shrink-0 w-14 h-14 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Comprehensive Curriculum</h3>
                    <p className="text-gray-600 leading-relaxed">
                      From fundamentals to advanced topics, structured learning paths designed by industry experts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start gap-4">
                  <div className="shrink-0 w-14 h-14 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Learn from the Best</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Connect with experienced instructors and a thriving community of learners.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-amber-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start gap-4">
                  <div className="shrink-0 w-14 h-14 bg-linear-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Industry Recognized</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Earn certificates that boost your resume and validate your expertise.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-fade-in-up-delay {
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }
      `}</style>
    </section>
  );
}
