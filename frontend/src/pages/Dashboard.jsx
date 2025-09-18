import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Plus,
  Star,
  Mail,
  GraduationCap
} from 'lucide-react';
import api from '../config/api';
import CourseForm from '../components/Forms/CourseForm';
import TestimonialForm from '../components/Forms/TestimonialForm';
import ContactForm from '../components/Forms/ContactForm';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    testimonials: 0,
    totalStudents: 0,
    avgRating: 0
  });
  const [activeForm, setActiveForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [coursesRes, testimonialsRes] = await Promise.all([
        api.get('/api/courses'),
        api.get('/api/testimonials')
      ]);

      const courses = coursesRes.data;
      const testimonials = testimonialsRes.data;

      // Calculate stats
      let totalStudents = 0;
      let totalRating = 0;
      let totalCourses = 0;

      courses.forEach(category => {
        category.courses.forEach(course => {
          totalCourses++;
          totalStudents += course.students || 0;
          totalRating += course.rating || 0;
        });
      });

      setStats({
        courses: totalCourses,
        testimonials: testimonials.length,
        totalStudents,
        avgRating: totalCourses > 0 ? (totalRating / totalCourses).toFixed(1) : 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Courses',
      value: stats.courses,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Testimonials',
      value: stats.testimonials,
      icon: MessageSquare,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      name: 'Average Rating',
      value: stats.avgRating,
      icon: Star,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  const quickActions = [
    {
      name: 'Add Course',
      description: 'Create a new course',
      icon: BookOpen,
      color: 'bg-blue-600',
      action: () => setActiveForm('course')
    },
    {
      name: 'Add Testimonial',
      description: 'Add student testimonial',
      icon: MessageSquare,
      color: 'bg-green-600',
      action: () => setActiveForm('testimonial')
    },
    {
      name: 'Send Message',
      description: 'Test contact form',
      icon: Mail,
      color: 'bg-purple-600',
      action: () => setActiveForm('contact')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to BMS Academy Admin Panel</p>
        </div>
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-semibold text-gray-900">BMS Academy</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.name}
              onClick={action.action}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium text-gray-900">{action.name}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Forms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Course Form */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add Course</h3>
            <BookOpen className="h-5 w-5 text-gray-400" />
          </div>
          <CourseForm onSuccess={fetchStats} />
        </div>

        {/* Testimonial Form */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add Testimonial</h3>
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
          <TestimonialForm onSuccess={fetchStats} />
        </div>

        {/* Contact Form */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Test Contact</h3>
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <ContactForm />
        </div>
      </div>

      {/* Modal for forms */}
      {activeForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {activeForm === 'course' && 'Add New Course'}
                {activeForm === 'testimonial' && 'Add New Testimonial'}
                {activeForm === 'contact' && 'Test Contact Form'}
              </h3>
              <button
                onClick={() => setActiveForm(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            {activeForm === 'course' && (
              <CourseForm 
                onSuccess={() => {
                  fetchStats();
                  setActiveForm(null);
                }} 
              />
            )}
            {activeForm === 'testimonial' && (
              <TestimonialForm 
                onSuccess={() => {
                  fetchStats();
                  setActiveForm(null);
                }} 
              />
            )}
            {activeForm === 'contact' && <ContactForm />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;