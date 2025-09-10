import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Brain, 
  Users, 
  Award, 
  Heart, 
  BarChart3,
  ArrowRight,
  Star,
  CheckCircle,
  Zap,
  Globe,
  Shield
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

function LandingPage() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Learning",
      description: "Personalized tutoring and adaptive learning paths powered by advanced AI"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Universal Accessibility",
      description: "WCAG 2.1 compliant with text-to-speech, sign language, and multi-language support"
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-600" />,
      title: "Gamification",
      description: "Engaging badges, leaderboards, and achievements to motivate learning"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Student Wellness",
      description: "Integrated mood tracking and stress-relief tools for holistic education"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Teacher Analytics",
      description: "Comprehensive insights and automated grading to enhance teaching efficiency"
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      title: "AI Lesson Planning",
      description: "Automated lesson plan generation and curriculum alignment tools"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Education Director, Lincoln High School",
      content: "EduNexus has transformed how we approach personalized learning. Our students are 40% more engaged.",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Mathematics Teacher",
      content: "The AI lesson planner saves me hours each week and the analytics help me support struggling students.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Grade 10 Student",
      content: "The gamification makes learning fun! I've earned 15 badges this month and love the daily challenges.",
      rating: 5
    }
  ];

  const stats = [
    { label: "Students Enrolled", value: "50,000+" },
    { label: "Teachers Active", value: "5,000+" },
    { label: "Lessons Completed", value: "2M+" },
    { label: "Schools Partnered", value: "500+" }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">EduNexus</span>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={() => navigate('/student-login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/student-login')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              EduNexus – The Smart
              <span className="text-blue-600"> Education Hub</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI-powered, Accessible, and Gamified Learning for Everyone. 
              Revolutionizing education with personalized experiences, universal accessibility, and data-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/student-login')} className="flex items-center gap-2">
                For Students <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/teacher-login')} className="flex items-center gap-2">
                For Teachers <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="ghost" onClick={() => navigate('/student-login')}>
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose EduNexus?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform addresses every aspect of modern education with cutting-edge technology and inclusive design.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Credibility */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enterprise-Ready Education Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by schools, universities, and educational institutions worldwide
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
              <p className="text-gray-600">SOC 2 compliant with end-to-end encryption and FERPA compliance</p>
            </Card>
            <Card className="text-center p-8">
              <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Global Scalability</h3>
              <p className="text-gray-600">Multi-language support serving institutions across 50+ countries</p>
            </Card>
            <Card className="text-center p-8">
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Proven ROI</h3>
              <p className="text-gray-600">40% improvement in student engagement and 60% reduction in grading time</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Education?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of educators and students already experiencing the future of learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="white" onClick={() => navigate('/student-login')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/teacher-login')} className="text-white border-white hover:bg-white hover:text-blue-600">
              For Teachers
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">EduNexus</span>
            </div>
            <p className="text-gray-400">
              © 2024 EduNexus. Empowering education through innovation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;