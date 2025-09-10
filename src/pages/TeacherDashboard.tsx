import React, { useState } from 'react';
import { 
  Users, 
  BarChart3, 
  BookOpen, 
  CheckCircle, 
  Calendar,
  TrendingUp,
  Award,
  Clock,
  FileText,
  Brain,
  Download,
  Plus
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import Chart from '../components/Chart';
import AILessonPlanner from '../components/AILessonPlanner';
import GradingTool from '../components/GradingTool';
import AttendanceTool from '../components/AttendanceTool';

function TeacherDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  // Add a new state for the search query
  const [searchQuery, setSearchQuery] = useState('');

  const teacherStats = {
    totalStudents: 125,
    activeClasses: 6,
    avgEngagement: 87,
    lessonsCreated: 32,
    pendingGrades: 18,
    weeklyHours: 12
  };

  const classAnalytics = [
    { class: "Mathematics 10A", students: 28, engagement: 92, avgGrade: 85 },
    { class: "Mathematics 10B", students: 25, engagement: 88, avgGrade: 82 },
    { class: "Advanced Algebra", students: 22, engagement: 95, avgGrade: 89 },
    { class: "Geometry", students: 30, engagement: 84, avgGrade: 78 },
    { class: "Statistics", students: 20, engagement: 91, avgGrade: 87 }
  ];

  const recentActivity = [
    { activity: "Quiz: Quadratic Equations", class: "Mathematics 10A", submitted: 25, total: 28 },
    { activity: "Assignment: Linear Functions", class: "Advanced Algebra", submitted: 20, total: 22 },
    { activity: "Project: Data Analysis", class: "Statistics", submitted: 18, total: 20 },
    { activity: "Homework: Chapter 5", class: "Geometry", submitted: 28, total: 30 }
  ];

  const teachingModules = [
    {
      title: "Classroom Analytics",
      description: "View student progress and engagement metrics",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "blue",
      action: () => setActiveTab('analytics')
    },
    {
      title: "AI Lesson Planner",
      description: "Generate lesson plans with AI assistance",
      icon: <Brain className="h-6 w-6" />,
      color: "purple",
      action: () => setActiveTab('planner')
    },
    {
      title: "Grading Tool",
      description: "Automated grading and feedback system",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "green",
      action: () => setActiveTab('grading')
    },
    {
      title: "Attendance",
      description: "Track and manage student attendance",
      icon: <Users className="h-6 w-6" />,
      color: "orange",
      action: () => setActiveTab('attendance')
    }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'planner':
        return <AILessonPlanner />;
      case 'grading':
        return <GradingTool />;
      case 'analytics':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">Student Engagement Trends</h3>
              <Chart 
                data={[
                  { name: 'Mon', engagement: 85, assignments: 12 },
                  { name: 'Tue', engagement: 88, assignments: 15 },
                  { name: 'Wed', engagement: 82, assignments: 10 },
                  { name: 'Thu', engagement: 91, assignments: 18 },
                  { name: 'Fri', engagement: 89, assignments: 16 },
                  { name: 'Sat', engagement: 75, assignments: 8 },
                  { name: 'Sun', engagement: 70, assignments: 6 }
                ]}
              />
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Class Performance Overview</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Class</th>
                      <th className="text-left py-2">Students</th>
                      <th className="text-left py-2">Engagement</th>
                      <th className="text-left py-2">Avg Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classAnalytics.map((cls, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 font-medium">{cls.class}</td>
                        <td className="py-2">{cls.students}</td>
                        <td className="py-2">
                          <div className={`px-2 py-1 rounded text-xs ${cls.engagement >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {cls.engagement}%
                          </div>
                        </td>
                        <td className="py-2 font-medium">{cls.avgGrade}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );
      case 'attendance':
        return <AttendanceTool />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Good morning, {user?.name}!</h1>
              <p className="text-green-100 text-lg">Ready to inspire and educate today? ✨</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{teacherStats.totalStudents} Students</div>
              <div className="text-green-100">{teacherStats.activeClasses} Active Classes</div>
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{teacherStats.totalStudents}</div>
                <div className="text-gray-600 text-sm">Total Students</div>
              </Card>

              <Card className="p-4 text-center">
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{teacherStats.activeClasses}</div>
                <div className="text-gray-600 text-sm">Active Classes</div>
              </Card>

              <Card className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{teacherStats.avgEngagement}%</div>
                <div className="text-gray-600 text-sm">Avg Engagement</div>
              </Card>

              <Card className="p-4 text-center">
                <FileText className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{teacherStats.lessonsCreated}</div>
                <div className="text-gray-600 text-sm">Lessons Created</div>
              </Card>

              <Card className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{teacherStats.pendingGrades}</div>
                <div className="text-gray-600 text-sm">Pending Grades</div>
              </Card>

              <Card className="p-4 text-center">
                <Clock className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{teacherStats.weeklyHours}h</div>
                <div className="text-gray-600 text-sm">Saved This Week</div>
              </Card>
            </div>

            {/* Teaching Modules */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Brain className="h-6 w-6 text-green-600" />
                Teaching Tools
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teachingModules.map((module, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-xl cursor-pointer transition-all hover:scale-105 bg-${module.color}-50 border-2 border-${module.color}-200 hover:border-${module.color}-400`}
                    onClick={module.action}
                  >
                    <div className={`text-${module.color}-600 mb-4`}>
                      {module.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                    <Button size="sm" className="w-full">
                      Open
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity and Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Recent Activity</h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{activity.activity}</div>
                          <div className="text-sm text-gray-600">{activity.class}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{activity.submitted}/{activity.total}</div>
                          <div className="text-xs text-gray-500">Submitted</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" onClick={() => setActiveTab('planner')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Lesson Plan
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('grading')}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Grade Assignments
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Class Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Parent Meeting
                  </Button>
                </div>
              </Card>
            </div>
          </>
        )}

        {renderActiveTab()}

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm">
          <Button 
            variant={activeTab === 'overview' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('overview')}
            className="flex-1"
          >
            Overview
          </Button>
          <Button 
            variant={activeTab === 'analytics' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('analytics')}
            className="flex-1"
          >
            Analytics
          </Button>
          <Button 
            variant={activeTab === 'planner' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('planner')}
            className="flex-1"
          >
            AI Planner
          </Button>
          <Button 
            variant={activeTab === 'grading' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('grading')}
            className="flex-1"
          >
            Grading
          </Button>
          <Button 
            variant={activeTab === 'attendance' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('attendance')}
            className="flex-1"
          >
            Attendance
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TeacherDashboard;